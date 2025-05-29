require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    // 1. Local Development (Ganache)
    development: {
      host: "127.0.0.1", 
      port: 7545,
      network_id: "1234",
      gas: 6721975,
      gasPrice: 20000000000  // 20 Gwei
    },
    
    // 2. Sepolia Testnet (Free for demos)
    sepolia: {
      provider: () => new HDWalletProvider({
        privateKeys: [process.env.PRIVATE_KEY],
        providerOrUrl: `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`
      }),
      network_id: 11155111,
      gas: 5500000,          
      gasPrice: 10000000000, // 10 Gwei (Sepolia is cheaper)
      confirmations: 2,      // Wait for 2 blocks
      timeoutBlocks: 200     // Max wait time
    }
  },
  compilers: {
  solc: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true, 
        runs: 200
      },
      evmVersion: "istanbul" // Add this line
    }
  }
},
  mocha: {
    timeout: 100000 // For slower testnets
  }
};