const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const assert = require('chai').assert;

// npx hardhat run scripts/deploy.js --network localhost
// npx hardhat console --network localhost
describe("Wallet", function () {
    
    let wallet, addr1, addr2;
    let contract = "0x0FBad4BBd23e89206317F95C2A9F2c11F5Ac3853";

    before(async function () {
        const Wallet = await hre.ethers.getContractFactory('Wallet');
        if (!!contract) {
            console.log('Attaching contract', contract)
            wallet = Wallet.attach(contract);
        } else {
            console.log('Deploying wallet...');
            const sh = await Wallet.deploy();
            wallet = await sh.deployed();
            console.log('Deployed wallet.', wallet.address);    
        }
        [owner, addr1, addr2 ] = await hre.ethers.getSigners();
    });

    describe("Valid Transactions", function () {
        const depositAddr1 = 2e9, depositAddr2 = 1e9;

        it('Should addr1 withdraw without ever despositing', async function() {
            await expect(wallet.connect(addr1).withdraw(50000)).to.be.revertedWith('Is not in users');
        });

        it(`Should addr1 deposit ${depositAddr1} to contract`, async () => {
            const deposit = await wallet.connect(addr1).deposit({from: addr1.address, value: depositAddr1});
            await deposit.wait();
            expect(deposit.value).to.be.not.undefined;
            expect(deposit.value).to.be.not.null;
            expect(deposit.value.toNumber()).to.equal(depositAddr1);
        });

        it(`Should addr1 withdraw before required number of blocks`, async function() {
            await expect(wallet.connect(addr1).withdraw(depositAddr1)).to.be.revertedWith('Block not satisfied');
        });

        it(`Should addr2 deposit ${depositAddr2} to contract`, async () => {
            const deposit = await wallet.connect(addr2).deposit({from: addr2.address, value: depositAddr2 });
            await deposit.wait();
            expect(deposit.value).to.be.not.undefined;
            expect(deposit.value).to.be.not.null;
            expect(deposit.value.toNumber()).to.equal(depositAddr2);
        });

        it(`Should addr1 withdraw more than deposit amt of ${depositAddr1}`, async function() {
            await expect(wallet.connect(addr1).withdraw(depositAddr1*1.1)).to.be.revertedWith('Nothing to withdraw');
        });

        it('Should owner withdraw all totalSupply', async () => {
            const withdrawAll = await wallet.withdrawAllFunds();
            const totalFunds = await wallet.totalSupply();
            expect(totalFunds.value).to.equal(0);
        });

        it('Should addr1 withdraw after owner withdraw all', async function() {
            await expect(wallet.connect(addr2).withdraw(depositAddr2)).to.be.revertedWith('Nothing to withdraw');
        });
    })

  });
  

