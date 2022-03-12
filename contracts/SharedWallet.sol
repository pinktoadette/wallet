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
    mapping(address => uint8) private _owners;
    uint public totalFunds = 0 ether;
    uint256 private blockCreate;

    mapping(address => uint) public _walletBalances;

    modifier isOwner() {
        require(msg.sender == _owner);
        _;
    }

    modifier hasBalance(uint256 amount) {
        require(address(this).balance >= amount);
        _;
    }

    modifier validOwners() {
        require(msg.sender == _owner || _owners[msg.sender] == 1);
        _;
    }

    event DepositFunds(address from, uint amount);
    event WithdrawFunds(address from, uint amount);
    event ViewBlocks(uint256 blocks);

    constructor() {
        _owner = msg.sender;
        blockCreate = block.number;
    }

    receive() external payable {
        _walletBalances[msg.sender] += msg.value;
        emit DepositFunds(msg.sender, msg.value);
    }

    function totalSupply() public view returns (uint256) {
        return totalFunds;
    }

     function addOwner(address owner)  isOwner public {
        _owners[owner] = 1;
    }

    function removeOwner(address owner) isOwner public {
        _owners[owner] = 0;   
    }

    function balanceOf(address account) public view returns (uint256) {
        return _walletBalances[account];
    }

    function deposit() payable public {
         assert(_walletBalances[msg.sender] + msg.value >= _walletBalances[msg.sender]);
         totalFunds += _walletBalances[msg.sender];
         emit DepositFunds(msg.sender, msg.value);
         emit ViewBlocks(blockCreate);
     }

    function withdraw(uint amount) validOwners public {
        require(blockCreate + 2  < block.number, "Required blocks not satisfied" );
        require(address(this).balance >= amount);
        payable(_owner).transfer(amount);
        totalFunds -= amount;
        emit WithdrawFunds(msg.sender, amount);
        emit ViewBlocks(blockCreate);
    }

    function emergencyWithdrawAllFunds() validOwners public {
        require(blockCreate + 2  < block.number, "Required blocks not satisfied" );
        require(address(this).balance > _walletBalances[msg.sender]);
        payable(_owner).transfer(address(this).balance);
        emit WithdrawFunds(msg.sender, _walletBalances[msg.sender]);
         emit ViewBlocks(blockCreate);
    }

    function viewBlock() public view returns (uint256) {
        return blockCreate;
    }


}
