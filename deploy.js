const { ethers, upgrades } = require("hardhat");

async function main() {
  // Deploy MyToken contract
  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await upgrades.deployProxy(MyToken, [1000]);
  await myToken.deployed();
  console.log("MyToken deployed to:", myToken.address);

  // Deploy MyNFT contract
  const MyNFT = await ethers.getContractFactory("MyNFT");
  const myNFT = await upgrades.deployProxy(MyNFT, [myToken.address]);
  await myNFT.deployed();
  console.log("MyNFT deployed to:", myNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
