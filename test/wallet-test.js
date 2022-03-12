const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");

describe("SharedWallet", function () {

    let wallet, addr1, addr2;

    beforeEach(async function () {
        await hre.network.provider.send("hardhat_reset")
    })

    before(async function () {
        console.log('getContractFactory wallet...');
        const SharedWallet = await hre.ethers.getContractFactory('SharedWallet');
        console.log('Deploying wallet.');
        wallet = await SharedWallet.deploy();
        const events = await wallet.deployed();
        console.log('Deployed wallet.', wallet.address);        
        [addr1, addr2 ] = await hre.ethers.getSigners();
        console.log(events.events?.filter((x) => {return x.event == "ViewBlocks"}) );
    });

    it('Should assign balance to right owner', async () => {
        const ownerBalance = await wallet.balanceOf(wallet.address);
        const balance = await ethers.provider.getBalance(wallet.address);
        expect(balance).to.equal(ownerBalance);
    });

    it('Should addr1 deposit 20000000000 to contract', async () => {
        const deposit = await wallet.deposit({from: addr1.address, value: 20000000000 });
        await deposit.wait();
        const balance = await ethers.provider.getBalance(wallet.address);

        expect(deposit.value).to.be.not.undefined;
        expect(deposit.value).to.be.not.null;
        expect(deposit.value.toNumber()).to.equal(20000000000);
        expect(balance).to.equal(20000000000);
    });

    it('Should addr1 deposit 100000000 to contract', async () => {
        const deposit = await wallet.deposit({from: addr1.address, value: 100000000 });
        const events = await deposit.wait();
        // console.log(events.events?.filter((x) => {return x.event == "ViewBlocks"}) );

        const balance = await ethers.provider.getBalance(wallet.address);
        console.log("balance after deposit", balance)
        expect(deposit.value).to.be.not.undefined;
        expect(deposit.value).to.be.not.null;
        expect(deposit.value.toNumber()).to.equal(100000000);
    });

    it('Should addr1 withdraw 50000000 from contract', async () => {
        const begin_balance = await ethers.provider.getBalance(wallet.address);
        console.log("begin balance", begin_balance)

        const withdraw = await wallet.withdraw(50000000, {from: addr1.address, value: 50000000 });
        const events = await withdraw.wait();
        console.log(events.events?.filter((x) => {return x.event == "WithdrawFunds"}) );

        const end_balance = await ethers.provider.getBalance(wallet.address);
        console.log(end_balance, begin_balance)
        expect(begin_balance - end_balance).to.equal(50000000);
    });

    // test addr2 withdrawing from this wallet

  });
  

