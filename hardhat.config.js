require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
const { PRIVATE_KEY1, PRIVATE_KEY2 } = require("./.secrets.json");

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
    matic: {
      url: `https://rpc-mumbai.maticvigil.com`,
      accounts: [PRIVATE_KEY1, PRIVATE_KEY2],
      gasLimit: 20000000,
      gasPrice: 25000000000,
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
},
};
