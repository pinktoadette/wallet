const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const assert = require('chai').assert;


describe("SharedWallet", function () {
    
    let wallet, addr1, addr2;
    let contract = "";

    before(async function () {
        console.log('getContractFactory wallet...');
        const SharedWallet = await hre.ethers.getContractFactory('SharedWallet');
        if (!!contract) {
            // if have contract address
            console.log('Attaching contract', contract)
            wallet = SharedWallet.attach(contract);
        } else {
            console.log('Deploying wallet...');
           const sh = await SharedWallet.deploy();
            wallet = await sh.deployed();
            console.log('Deployed wallet.', wallet.address);    
        }
        [owner, addr1, addr2 ] = await hre.ethers.getSigners();
        console.log("owner", owner.address)
    });

    describe("Check owner", function () {
        it('Should contract belongs to owner', async () => {
            const user1 = await wallet.addUser(owner.address);
            expect(user1.from).to.equal(owner.address);
        });
    })

    describe("Add user", function () {
        it('Should add new addr1 in wallet', async () => {
            const user1 = await wallet.addUser(addr1.address);
            expect(user1.from).to.equal(owner.address);
        });
    })

    // describe("Test invalid transactions", function() {
    //     it("Should throw error with only 1 block", function() {
    //         return wallet.connect(addr1).withdraw(50000)
    //              .then(assert.fail)
    //              .catch(function(error) {
    //                     assert.include(
    //                         error.message,
    //                         'Block not satisfied',
    //                         'OK'
    //                     )
    //              });
    //     });

    //     it("Should addr2 withdraw 100000 with no deposit", function() {
    //         return wallet.connect(addr2).withdraw(100000)
    //              .then(assert.fail)
    //              .catch(function(error) {
    //                     assert.include(
    //                         error.message,
    //                         'Not enough funds',
    //                         'OK'
    //                     )
    //              });
    //     });
    // })

    describe("Valid Transactions", function () {
        it('Should addr1 deposit 20000000000 to contract', async () => {
            const deposit = await wallet.connect(addr1).deposit({from: addr1.address, value: 20000000000 });
            await deposit.wait();
            const balance = await wallet.balanceOf(addr1.address);
            expect(deposit.value).to.be.not.undefined;
            expect(deposit.value).to.be.not.null;
            expect(deposit.value.toNumber()).to.equal(20000000000);
            expect(balance).to.equal(20000000000);
        });

        it('Should addr2 deposit 40000 to contract', async () => {
            const deposit = await wallet.connect(addr2).deposit({from: addr2.address, value: 40000 });
            await deposit.wait();
            expect(deposit.value).to.be.not.undefined;
            expect(deposit.value).to.be.not.null;
            expect(deposit.value.toNumber()).to.equal(40000);
        });

        it('Should owner withdraw all totalSupply', async () => {
            await wallet.emergencyWithdrawAllFunds();
            const totalSupply = await wallet.totalSupply();
            console.log(totalSupply)
            expect(totalSupply).to.equal(0);
        });
    })

  });
  

