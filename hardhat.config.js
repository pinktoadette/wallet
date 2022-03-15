require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
const { TEST_NET_PRIVATE_KEY1, TEST_NET_PRIVATE_KEY2, TEST_NET_PRIVATE_KEY3 } = require("./.secrets.json");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * npx hardhat compile
 * npx hardhat test
 * npx hardhat run scripts/wallet-script.js --network localhost
 * 
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "matic",
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
    },
    localhost: {
      host: "127.0.0.1",     
      port: 8545,            
      network_id: "*",       
    },
    matic: {
      url: `https://rpc-mumbai.maticvigil.com`,
      accounts: [TEST_NET_PRIVATE_KEY1, TEST_NET_PRIVATE_KEY2, TEST_NET_PRIVATE_KEY3],
      gasPrice: 50000000000,
      gasLimit: 50000000000
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
},
};
