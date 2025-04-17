
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.28",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", // Ganache 默认 RPC
      accounts: [
        // 填入 Ganache 的第一个账户私钥（从 Ganache 界面复制）
        // "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"
        // "0x60cc3518a7d46e22291f596e05e76979ec01f57d177189db4e32e7e8dbf30ad4"
        "0x347019dc1a8e818ee1479de5a4251783def68c64ba679712149c2e098adaf500"
      ]
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "../frontend/src/artifacts"
  }
};