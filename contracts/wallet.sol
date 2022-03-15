// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Wallet {
    
    address public _owner;
    uint public totalFunds = 0 ether;
    uint256 public _blockCreate;

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
        _users[msg.sender];
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

    function balanceOf(address account) public view returns (uint256) {
        return _walletBalances[account];
    }

    function deposit() public payable {
        require(msg.value > 0, "Nothing to deposit");
        addUser(msg.sender);
        payable(address(this)).transfer(msg.value);
        totalFunds += msg.value;
        _walletBalances[msg.sender] += msg.value;
        emit DepositFunds(msg.sender, msg.value);
        emit ViewCurrentBlock(block.number);
     }

    function withdraw(uint amount) isUsers public {
        require(_blockCreate + 2  < block.number, "Block not satisfied" );
        require(_walletBalances[msg.sender] <= amount, "Insufficient funds");
        if (totalFunds==0) {
            // avoid for loops, assign if owner becomes bad actor
            // user should still be able to withdraw, if someone else deposits
            _walletBalances[msg.sender] = 0; 
        }
        require(_walletBalances[msg.sender] > 0, "Nothing to withdraw");
        payable(_owner).transfer(amount);
        _walletBalances[msg.sender] -= amount;
        totalFunds -= amount;
        emit WithdrawFunds(msg.sender, amount);
        emit ViewBlocks(_blockCreate);
    }

    function withdrawAllFunds() isOwner public {
        require(_blockCreate + 2  < block.number, "Block not satisfied" );
        require(address(this).balance > 0, "Nothing to withdraw");
        payable(_owner).transfer(totalFunds);
        totalFunds -= totalFunds;
        emit WithdrawFunds(msg.sender, _walletBalances[msg.sender]);
        emit ViewBlocks(_blockCreate);
    }

    function viewBlock() public view returns (uint) {
        return _blockCreate;
    }


}
