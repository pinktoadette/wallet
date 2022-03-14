// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Wallet {
    
    address public _owner;
    uint public totalFunds = 0 ether;
    uint256 public _blockCreate;
    bool public _isEmpty;

    mapping(address => uint) public _walletBalances;
    mapping(address => bool) public _users;

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
        _blockCreate = block.number;
    }

    modifier isUsers() {
        require(msg.sender == _owner || _users[msg.sender] , "Is not in users");
        _;
    }

    fallback () external payable {
        _walletBalances[msg.sender] += msg.value;
    }

    receive() external payable {}

    function addUser(address user) 
        isOwner 
        public {
        _users[user] = true;
    }

    function removeOwner(address user)
        isOwner
        public {
        _users[user] = false;   
    }

    function totalSupply() public view returns (uint256) {
        return totalFunds;
    }


    function balanceOf(address account) public returns (uint256) {
        // avoid for loops when owner withdraw all
        if (_isEmpty) { 
            _walletBalances[account] = 0;
        }
        return _walletBalances[account];
    }

    function deposit() public payable {
         totalFunds += msg.value;
         _walletBalances[msg.sender] += msg.value;
         _isEmpty = false;
         emit DepositFunds(msg.sender, msg.value);
         emit ViewCurrentBlock(block.number);
     }

    function withdraw(uint amount) isUsers public {
        require(_blockCreate + 2  < block.number, "Block not satisfied" );
        require(_walletBalances[msg.sender] > 0, "Not enough funds");
        _walletBalances[msg.sender] -= amount;
        totalFunds -= amount;
        payable(_owner).transfer(amount);
        emit WithdrawFunds(msg.sender, amount);
        emit ViewBlocks(_blockCreate);
    }

    function emergencyWithdrawAllFunds() isOwner public {
        require(_blockCreate + 2  < block.number, "Block not satisfied" );
        require(address(this).balance > 0, "Nothing to withdraw");
        payable(_owner).transfer(totalFunds);
        totalFunds -= totalFunds;
        _isEmpty = true;
        emit WithdrawFunds(msg.sender, _walletBalances[msg.sender]);
        emit ViewBlocks(_blockCreate);
    }

    function viewBlock() public view returns (uint) {
        return _blockCreate;
    }


}
