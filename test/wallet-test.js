const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const assert = require('chai').assert;

// npx hardhat console --network localhost
describe("Wallet", function () {
    
    let wallet, addr1, addr2;
    let contract = "0x0B306BF915C4d645ff596e518fAf3F9669b97016";

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

    describe("Add user", function () {
        it('Should add new addr1 in wallet', async () => {           
            const user1 = await wallet.addUser(addr1.address);
            expect(user1.from).to.equal(owner.address);
        });
    })

    describe("Test invalid transactions", function() {
        it('Test should throw error if request not found', async function() {
            const withdraw = await wallet.connect(addr1).withdraw(50000)
            expect(withdraw.value.toNumber()).to.equal(0);
        });
    })

    describe("Valid Transactions", function () {
        it('Should addr1 deposit 20000000000 to contract', async () => {
            const deposit = await wallet.connect(addr1).deposit({from: addr1.address, value: 20000000000 });
            await deposit.wait();
            expect(deposit.value).to.be.not.undefined;
            expect(deposit.value).to.be.not.null;
            expect(deposit.value.toNumber()).to.equal(20000000000);
        });

        it('Should addr2 deposit 40000 to contract', async () => {
            await wallet.addUser(addr2.address);
            const deposit = await wallet.connect(addr2).deposit({from: addr2.address, value: 40000 });
            await deposit.wait();
            expect(deposit.value).to.be.not.undefined;
            expect(deposit.value).to.be.not.null;
            expect(deposit.value.toNumber()).to.equal(40000);
        });

        it('Should owner withdraw all totalSupply', async () => {
            const withdrawAll = await wallet.emergencyWithdrawAllFunds();
            const ownerBal = await wallet.balanceOf(owner.address);
            const walletBal = await wallet.balanceOf(wallet.address);
            expect(ownerBal.value).to.equal(0);
            expect(walletBal.value).to.equal(0);
        });
    })

  });
  

