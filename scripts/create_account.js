const ethers = require('ethers');
let mnemonic = "";
let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
console.log(mnemonicWallet.privateKey)