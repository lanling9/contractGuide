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