const { ethers } = require('ethers');
const { API_URL } = require('./api');
const { contractABI } = require('./contractABI');

const IPFS_GATEWAYS = [
  "https://ipfs.io/ipfs/",
  "https://ipfs.filebase.io/ipfs/",
  "https://crustwebsites.net/ipfs/"
];

// Environment variables
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RPC_URL = process.env.ETH_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Initialize provider using JsonRpcProvider
const getProvider = () => {
  try {
    return new ethers.JsonRpcProvider(RPC_URL);
  } catch (error) {
    console.error('Error creating provider:', error);
    throw new Error('Failed to initialize provider');
  }
};

// Initialize contract instance function with validation
const getContract = async () => {
  try {
    const provider = getProvider();
    
    // Create wallet instance
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    
    // Create contract instance with ethers v6 syntax
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      contractABI,
      wallet
    );

    // Validate contract functions exist
    const interface = contract.interface;
    if (!interface.hasFunction('addCid')) {
      throw new Error('Contract is missing addCid function');
    }
    if (!interface.hasFunction('getUserCidCount')) {
      throw new Error('Contract is missing getUserCidCount function');
    }

    return contract;
  } catch (error) {
    console.error('Error initializing contract:', error);
    throw new Error(`Contract initialization failed: ${error.message}`);
  }
};

const fetchFromIPFS = async (cid) => {
  for (let gateway of IPFS_GATEWAYS) {
    try {
      console.log(`Attempting to fetch from gateway: ${gateway}`);
      const response = await fetch(`${gateway}${cid}`);
      if (!response.ok) {
        console.warn(`Gateway ${gateway} failed with status: ${response.status}`);
        continue;
      }
      return await response.blob();
    } catch (error) {
      console.error(`Error with gateway ${gateway}:`, error);
    }
  }
  throw new Error("Failed to fetch PDF from all IPFS gateways");
};

const getIPFSUrl = (cid) => {
  return `https://ipfs.io/ipfs/${cid}`;
};

const storeCIDOnChain = async (contractId, cid) => {
  try {
    console.log('Storing CID on blockchain for contract:', contractId);
    console.log('CID:', cid);
    
    // Validate inputs
    if (!contractId || !cid) {
      throw new Error('ContractId and CID are required');
    }
    
    const contract = await getContract();
    
    // Store CID on blockchain with proper error handling
    const tx = await contract.addCid(cid, {
      gasLimit: 200000
    }).catch(error => {
      console.error('Transaction failed:', error);
      throw new Error(`Transaction failed: ${error.message}`);
    });
    
    console.log('Transaction sent:', tx.hash);
    
    // Wait for transaction to be mined with timeout
    const receipt = await Promise.race([
      tx.wait(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Transaction timeout')), 60000)
      )
    ]);
    
    console.log('Transaction confirmed in block:', receipt.blockNumber);
    
    return {
      success: true,
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Error storing CID on blockchain:', error);
    return {
      success: false,
      error: error.message || 'Failed to store CID on blockchain'
    };
  }
};

const getCIDFromChain = async (contractId) => {
  try {
    console.log('Getting CID from blockchain for contract:', contractId);
    
    // Validate input
    if (!contractId) {
      throw new Error('ContractId is required');
    }
    
    const contract = await getContract();
    
    // Get the user's address from the wallet
    const userAddress = await contract.signer.getAddress();
    
    // Get the count of CIDs for the user
    const cidCount = await contract.getUserCidCount(userAddress);
    
    if (cidCount === 0) {
      throw new Error('No CIDs found for this user');
    }
    
    // Get the latest CID (last index)
    const latestCid = await contract.getUserCidByIndex(userAddress, cidCount - 1);
    
    console.log('Retrieved CID from blockchain:', latestCid);
    
    return {
      success: true,
      cid: latestCid
    };
  } catch (error) {
    console.error('Error getting CID from blockchain:', error);
    return {
      success: false,
      error: error.message || 'Failed to get CID from blockchain'
    };
  }
};

const downloadContractPDF = async (contractId) => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Authentication token not found');
    }

    // First, get the contract details to get the latest CID
    const contractResponse = await fetch(`${API_URL}/contracts/${contractId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!contractResponse.ok) {
      throw new Error(`Failed to fetch contract details: ${contractResponse.status}`);
    }

    const contractData = await contractResponse.json();
    if (!contractData.contract || !contractData.contract.cids || contractData.contract.cids.length === 0) {
      throw new Error('No PDF available for this contract');
    }

    // Get the latest CID
    const latestCid = contractData.contract.cids[contractData.contract.cids.length - 1];
    const pdfUrl = `https://ipfs.io/ipfs/${latestCid}`;

    // Open the PDF in a new tab
    window.open(pdfUrl, '_blank');

    return {
      success: true,
      pdfUrl,
      message: 'PDF opened successfully'
    };
  } catch (error) {
    console.error('Error downloading contract:', error);
    return {
      success: false,
      error: error.message || 'Failed to download contract'
    };
  }
};

const viewContractOnIPFS = async (contractId) => {
  try {
    console.log("Fetching contract details for ID:", contractId);
    const response = await fetch(`${API_URL}/contracts/${contractId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.contract) {
      throw new Error("No contract found with this ID");
    }

    const contract = data.contract;
    if (!contract.cids || contract.cids.length === 0) {
      throw new Error("Contract has no PDF CIDs");
    }

    const latestCID = contract.cids[contract.cids.length - 1];
    console.log("Latest CID:", latestCID);

    const pdfBlob = await fetchFromIPFS(latestCID);
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    return {
      success: true,
      pdfUrl,
      cid: latestCID,
      message: 'Contract PDF retrieved successfully'
    };
  } catch (error) {
    console.error("Error viewing contract:", error);
    return {
      success: false,
      error: error.message || 'Failed to view contract on IPFS'
    };
  }
};

const verifyContract = async (contractId) => {
  try {
    console.log("Verifying contract on blockchain for ID:", contractId);
    
    // Get CID from blockchain
    const blockchainResult = await getCIDFromChain(contractId);
    if (!blockchainResult.success) {
      throw new Error(blockchainResult.error);
    }

    // Get contract details from backend
    const response = await fetch(`${API_URL}/contracts/verify/${contractId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Backend verification response:", data);

    // Compare CIDs
    const isVerified = data.cid === blockchainResult.cid;

    return {
      success: true,
      isVerified,
      blockchainCID: blockchainResult.cid,
      backendCID: data.cid,
      verificationTimestamp: new Date().toISOString(),
      message: isVerified ? 'Contract verified successfully' : 'Contract verification failed - CIDs do not match'
    };
  } catch (error) {
    console.error("Error verifying contract:", error);
    return {
      success: false,
      error: error.message || 'Failed to verify contract'
    };
  }
};

const handleDownload = async (contractId) => {
  try {
    const result = await downloadContractPDF(contractId);
    if (result.success) {
      window.open(result.pdfUrl, '_blank');
    } else {
      console.error('Download failed:', result.error);
      // Handle download failure
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    // Handle unexpected errors
  }
};

const handleVerification = async (contractId) => {
  try {
    const result = await verifyContract(contractId);
    if (result.success) {
      console.log('Contract verified:', result.isVerified);
      // Handle successful verification
    } else {
      console.error('Verification failed:', result.error);
      // Handle verification failure
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    // Handle unexpected errors
  }
};

const handleStoreCID = async (contractId, cid) => {
  try {
    const result = await storeCIDOnChain(contractId, cid);
    if (result.success) {
      console.log('CID stored successfully:', result.transactionHash);
      // Handle successful storage
    } else {
      console.error('Failed to store CID:', result.error);
      // Handle storage failure
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    // Handle unexpected errors
  }
};

module.exports = {
  storeCIDOnChain,
  getCIDFromChain,
  getIPFSUrl,
  fetchFromIPFS
};