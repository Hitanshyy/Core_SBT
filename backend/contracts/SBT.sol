// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract SoulboundToken is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    constructor() ERC721("Soulbound Token", "SBT") {}

    event SBTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);

    function mint(string memory uri) external returns (uint256) {
        uint256 newTokenId = ++_tokenIds;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, uri);

        emit SBTMinted(msg.sender, newTokenId, uri);

        return newTokenId;
    }

    function currentTokenId() external view returns (uint256) {
        return _tokenIds;
    }

    /// @notice Burn `tokenId`.
    /// @dev Only the token owner or the contract owner can burn the token.
    /// @param tokenId The ID of the token to burn.
    function burn(uint256 tokenId) external {
        address tokenOwner = ownerOf(tokenId);
        require(
            _msgSender() == tokenOwner || _msgSender() == owner(),
            "SoulboundToken: caller is not token owner nor contract owner"
        );
        _burn(tokenId);
    }

    /// @dev Disable transfers by using beforeTokenTransfer hook.
   function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId,
    uint256 batchSize
) internal override(ERC721) {
    require(from == address(0) || to == address(0), "SoulboundToken: transfers are disabled");
    super._beforeTokenTransfer(from, to, tokenId, batchSize);
}
    /// @dev Disable approvals.
    function approve(address to, uint256 tokenId) public pure override(ERC721, IERC721) {
        revert("SoulboundToken: approvals are disabled");
    }

    /// @dev Disable batch approvals.
    function setApprovalForAll(address operator, bool approved) public pure override(ERC721, IERC721) {
        revert("SoulboundToken: approvals are disabled");
    }

    /// @dev Return zero address for getApproved.
    function getApproved(uint256 tokenId) public pure override(ERC721, IERC721) returns (address) {
        return address(0);
    }

    /// @dev Return false for isApprovedForAll.
    function isApprovedForAll(address owner, address operator) public pure override(ERC721, IERC721) returns (bool) {
        return false;
    }
}
