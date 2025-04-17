#基于 React + Hardhat + web3.js 的完整项目流程，包含部署脚本和前端调用代码：
1. 项目初始化
```
# 创建项目目录
mkdir my-dapp && cd my-dapp

# 初始化 React 前端
npx create-react-app frontend
npm install web3 --save

# 初始化 Hardhat 后端
mkdir backend && cd backend
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init # 选择 JavaScript 模板
```
---
2. 智能合约代码
```
在 backend/contracts/Storage.sol 中写入：
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Storage {
    uint256 private data;
    
    function setData(uint256 _data) public {
        data = _data;
    }
    
    function getData() public view returns (uint256) {
        return data;
    }
}
```
---
3. 部署脚本 backend/scripts/deploy.js
```
const hre = require("hardhat");

async function main() {
  // 1. 获取合约工厂
  const Storage = await hre.ethers.getContractFactory("Storage");
  
  // 2. 部署合约（直接通过 deploy() 完成部署）
  const storage = await Storage.deploy();
//   console.log(storage,'---')
  // 3. 显式等待部署完成（针对某些环境）
    await storage.waitForDeployment();
  // 3. 直接访问合约地址（无需调用 .deployed()）
  console.log("✅ 合约部署成功，地址:", storage.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```
---
4. Hardhat 配置 backend/hardhat.config.js
```
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.24",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", // Ganache 默认 RPC
      accounts: [
        // 填入 Ganache 的第一个账户私钥（从 Ganache 界面复制）
        "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"
      ]
    }
  }
};
```
---
5. 部署到 Ganache
# 启动 Ganache（保持运行）
# 在 backend 目录执行：
npx hardhat run scripts/deploy.js --network ganache
终端会输出合约地址（示例）：
✅ 合约部署成功，地址: 0x5FbDB2315678afecb367f032d93F642f64180aa3

---
6. React 前端调用（frontend/src/App.js）
```
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import StorageABI from '../backend/artifacts/contracts/Storage.sol/Storage.json'; // 导入 ABI

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [data, setData] = useState('');

  // 初始化 Web3 和合约
  useEffect(() => {
    const init = async () => {
      const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      const web3Instance = new Web3(provider);
      setWeb3(web3Instance);

      // 合约地址从部署结果复制
      const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
      const contractInstance = new web3Instance.eth.Contract(
        StorageABI.abi, 
        contractAddress
      );
      setContract(contractInstance);
    };
    init();
  }, []);

  // 获取数据
  const getData = async () => {
    const result = await contract.methods.getData().call();
    setData(result);
  };

  // 设置数据
  const setDataToContract = async () => {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.setData(100).send({ from: accounts[0] });
    getData(); // 更新显示
  };

  return (
    <div>
      <button onClick={getData}>获取数据</button>
      <button onClick={setDataToContract}>设置数据为 100</button>
      <p>当前数据: {data}</p>
    </div>
  );
}

export default App;
```
---
7. 关键点说明
1. 合约地址获取位置：
  - 部署后终端直接输出（0x5FbDB2315678afecb367f032d93F642f64180aa3）
  - 需要手动复制到前端代码的 contractAddress 变量中
2. ABI 文件路径：
  - Hardhat 编译后自动生成 backend/artifacts/contracts/Storage.sol/Storage.json
  - 通过相对路径导入到 React 组件
3. Ganache 配置验证：
  - 确保 RPC URL（http://127.0.0.1:7545）与 Ganache 界面显示一致
  - 账户私钥需从 Ganache 的第一个账户复制

---
8. 运行流程
1. 启动 Ganache（保持运行）
2. 部署合约：
cd backend && npx hardhat run scripts/deploy.js --network ganache
3. 启动 React 前端：
cd frontend && npm start
4. 在浏览器中测试按钮功能：
  - 点击 "设置数据为 100" → 交易确认后，点击 "获取数据" 应显示 100

---
通过以上代码，你可以实现从合约部署到前端交互的完整流程。实际开发中建议将合约地址和 ABI 提取到配置文件中。

问题
解决 React 项目无法跨目录导入文件 的两种常用方法
1、在 React 项目中创建合约目录
在 frontend/src 下新建 contracts 目录，存放合约的 ABI 文件：
cp backend/artifacts/contracts/Storage.sol/Storage.json frontend/src/contracts/
修改 React 导入路径
在 frontend/src/App.js 中更新导入语句：
// 原错误路径（跨目录）：
// import StorageABI from '../backend/artifacts/contracts/Storage.sol/Storage.json';

// 修改为（正确路径）：
import StorageABI from './contracts/Storage.json';
2、自动化流程（可选）
在 backend/package.json 中添加脚本，自动复制 ABI 到前端：
```
{
  "scripts": {
    "compile": "hardhat compile",
    "deploy": "hardhat run scripts/deploy.js --network ganache",
    "copy-abi": "cp artifacts/contracts/Storage.sol/Storage.json ../frontend/src/contracts/Storage.json"
  }
}
```
每次编译合约后执行：
```
npm run compile && npm run copy-abi
```