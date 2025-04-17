// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Storage {
    uint256 private data;
    event TransferLog(address indexed from, address indexed to, uint256 amount);
    event MyEvent(uint256 value);
    event SetDataLog(uint numB);

    uint256 public counter;

    function incrementCounter() public {
        counter++;
        emit MyEvent(counter); // 触发事件，传递当前的 counter 值
    }
    
    function getLog(address _to, uint _amount) external returns(uint){
        // require(_to != address(0), "Invalid recipient");
        require(_amount > 3, "Amount must be greater than 3");
        
        emit TransferLog(msg.sender,_to,_amount);
        return _amount;
    }

    function triggerEvent(uint256 _value) public {
      require(_value < 10,'Invalid input string2233');
        emit MyEvent(_value);
    }

    function setData(uint256 _data) public {
        data = _data;
    }
    
    function getData() public returns (uint256) {
        require(data > 3, "Amount must be greater than 3");
        emit SetDataLog(data);
        return data;
    }
}