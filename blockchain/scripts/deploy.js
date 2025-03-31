const hre = require("hardhat");

async function main() {
  console.log("Deploying IPFSStorage contract...");
  
  const IPFSStorage = await hre.ethers.getContractFactory("IPFSStorage");
  const ipfsStorage = await IPFSStorage.deploy();
  
  await ipfsStorage.waitForDeployment();
  
  const address = await ipfsStorage.getAddress();
  console.log("IPFSStorage deployed to:", address);

//   const contractAddress = localStorage.getItem('lastDeployedContract');
//   const ipfsHash = localStorage.getItem('lastIpfsHash');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });