const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT", () => {
  let myToken;
  let myNFT;

  const recipient = "0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF";
  const tokenURI = "https://eips.ethereum.org/EIPS/eip-721";
  const erc20Amount = 1000;

  beforeEach(async () => {
    const MyToken = await ethers.getContractFactory("MyToken");
    myToken = await MyToken.deploy(10000);

    const MyNFT = await ethers.getContractFactory("MyNFT");
    myNFT = await MyNFT.deploy(myToken.address);

    await myToken.deployed();
    await myNFT.deployed();
  });

  it("should mint NFT and transfer ERC20 tokens", async () => {
    const tokenId = await myNFT.mintNFT(recipient, tokenURI);

    const ownerBalanceBefore = await myToken.balanceOf(await ethers.getSigners()[0].address);
    const recipientBalanceBefore = await myToken.balanceOf(recipient);

    expect(ownerBalanceBefore.toNumber()).to.equal(9000, "Invalid owner balance before transfer");
    expect(recipientBalanceBefore.toNumber()).to.equal(0, "Invalid recipient balance before transfer");

    await myToken.approve(myNFT.address, erc20Amount);
    await myNFT.redeemNFT(tokenId);

    const ownerBalanceAfter = await myToken.balanceOf(await ethers.getSigners()[0].address);
    const recipientBalanceAfter = await myToken.balanceOf(recipient);

    expect(ownerBalanceAfter.toNumber()).to.equal(9000 + erc20Amount, "Invalid owner balance after transfer");
    expect(recipientBalanceAfter.toNumber()).to.equal(erc20Amount, "Invalid recipient balance after transfer");
  });
});
