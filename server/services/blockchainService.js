import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const verifyContractOnChain = async (contractId) => {
  try {
    const response = await axios.get(`${API_URL}/contracts/verify/${contractId}`);
    return response.data;
  } catch (error) {
    console.error('Error verifying contract on blockchain:', error);
    throw error;
  }
};

export const getTransactionStatus = async (txHash) => {
  try {
    const response = await axios.get(`${API_URL}/blockchain/transaction/${txHash}`);
    return response.data;
  } catch (error) {
    console.error('Error getting transaction status:', error);
    throw error;
  }
}; 