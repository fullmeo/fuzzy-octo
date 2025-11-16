import { ethers } from 'ethers';

// Initialize the provider and signer
const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;

// Request account access if needed
async function requestAccount() {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  signer = provider.getSigner(accounts[0]);
}

// Function to get the balance of a token for a specific address
export async function getTokenBalance(tokenAddress, userAddress) {
  const tokenContract = new ethers.Contract(tokenAddress, [
    // ERC20 Token Standard ABI
    'function balanceOf(address owner) view returns (uint256)',
  ], signer);

  const balance = await tokenContract.balanceOf(userAddress);
  return ethers.utils.formatUnits(balance, 18); // Assuming 18 decimals
}

// Function to transfer tokens from the user's account
export async function transferTokens(tokenAddress, to, amount) {
  const tokenContract = new ethers.Contract(tokenAddress, [
    // ERC20 Token Standard ABI
    'function transfer(address to, uint256 amount) returns (bool)',
  ], signer);

  const tx = await tokenContract.transfer(to, ethers.utils.parseUnits(amount, 18)); // Assuming 18 decimals
  await tx.wait();
  return tx;
}

// Function to get the current network
export async function getNetwork() {
  const network = await provider.getNetwork();
  return network;
}

// Function to switch to a different network
export async function switchNetwork(chainId) {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: ethers.utils.hexValue(chainId) }],
  });
}

// Exporting the functions
export { requestAccount };