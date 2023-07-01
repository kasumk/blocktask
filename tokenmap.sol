// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./erc20.sol";



contract MyNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    event NFTMinted(address indexed recipient, uint256 indexed tokenId);
    event NFTRedeemed(address indexed owner, uint256 indexed tokenId);
    event TokenTransferred(address indexed from, address indexed to, uint256 amount);

    Counters.Counter private _tokenIds;

    ERC20 public myToken;

    constructor(address erc20TokenAddress) ERC721("MyNFT", "NFT") {
        myToken = ERC20(erc20TokenAddress);
    }

    function mintNFT(address recipient, string memory tokenURI) external {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();

        _mint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);

        uint256 erc20Amount = 1000;
        myToken.transferFrom(msg.sender, address(this), erc20Amount);

        emit NFTMinted(recipient, tokenId);
    }

    function redeemNFT(uint256 tokenId) external {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Transfer caller is not owner nor approved.");
        address tokenOwner = ownerOf(tokenId);

        _burn( tokenId);
        uint256 erc20Amount = 1000;
        myToken.transfer(tokenOwner, erc20Amount);

        emit NFTRedeemed(tokenOwner, tokenId);
    }

    function transferNFT(address to, uint256 tokenId) external {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Transfer caller is not owner nor approved.");
        _transfer(msg.sender, to, tokenId);
    }

    function transferToken(address to, uint256 amount) external {
        require(amount > 0, "Token amount must be greater than zero.");
        myToken.transferFrom(msg.sender, to, amount);
         emit TokenTransferred(msg.sender, to, amount);
    }
}