// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "hardhat/console.sol";

// Description:
// This is a naive implementation (and just a stupid idea altogether) of a shared wallet where users can:
// 1. Deposit funds in the contract and have their balances tracked.
// 2. A user should not be able to withdraw from their wallet until at least 2 blocks have passed since the wallet
// was initially created (not yet implemented).
// 3. Withdraw funds up to the amount that they have deposited.
// 4. The owner of the contract should also have the ability to emergency withdraw all of the funds.

// There are a number of bugs and security vulnerabilities.


// TODO:
// 1. Please remedy as many bugs/exploits as you can.
// 2. Implement the 2 block withdrawal time limit outlined in #2 above ^.
// 3. Deploy the contract to the Polygon Mumbai Testnet and send your recruiter the contract address.

contract SharedWallet {
    
    address public _owner;
    uint public totalFunds = 0 ether;
    uint256 private blockCreate;

    mapping(address => uint) public _walletBalances;

    modifier isOwner() {
        require(msg.sender == _owner, "Not the owner");
        _;
    }

    event DepositFunds(address from, uint amount);
    event WithdrawFunds(address from, uint amount);
    event ViewBlocks(uint blocks);
    event ViewCurrentBlock(uint block);

    constructor() {
        _owner = msg.sender;
        blockCreate = block.number;
    }

    receive() external payable {
        _walletBalances[msg.sender] += msg.value;
    }

    function totalSupply() public view returns (uint256) {
        return totalFunds;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _walletBalances[account];
    }

    function deposit() payable public {
         assert(_walletBalances[msg.sender] + msg.value >= _walletBalances[msg.sender]);
         totalFunds += msg.value;
         _walletBalances[msg.sender] += msg.value;
         emit DepositFunds(msg.sender, msg.value);
         emit ViewCurrentBlock(block.number);
     }

    function withdraw(uint amount) isOwner public {
        require(blockCreate + 2  < block.number, "Block not satisfied" );
        require(address(this).balance >= amount, "Not enough funds");
        _walletBalances[msg.sender] -= amount;
        totalFunds -= amount;
        payable(_owner).transfer(amount);
        emit WithdrawFunds(msg.sender, amount);
        emit ViewBlocks(blockCreate);
    }

    function emergencyWithdrawAllFunds() isOwner public {
        require(blockCreate + 2  < block.number, "Block not satisfied" );
        require(_walletBalances[msg.sender] > 0);
        payable(_owner).transfer(_walletBalances[msg.sender]);
        totalFunds -= _walletBalances[msg.sender];
        _walletBalances[msg.sender] = 0;
        emit WithdrawFunds(msg.sender, _walletBalances[msg.sender]);
        emit ViewBlocks(blockCreate);
    }

    function viewBlock() public view returns (uint) {
        return blockCreate;
    }


}
