// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract Poster is Context {
    address public owner;
    address public tokenAddress;
    uint256 public threshold;
    event NewPost(address indexed user, string content, string indexed tag);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event TokenAddressChanged(address indexed token);
    event ThresholdChanged(uint256 threshold);

    constructor(address token_, uint256 threshold_) {
        owner = _msgSender();
        emit OwnershipTransferred(address(0), owner);
        tokenAddress = token_;
        threshold = threshold_;
    }
    modifier onlyOwner() {
        require(owner == _msgSender(), "Ownable: caller is not the owner");
        _;
    }
    function post(string memory content, string memory tag) public {
        require(IERC20(tokenAddress).balanceOf(_msgSender()) >= threshold, "Not enough tokens");
        emit NewPost(_msgSender(), content, tag);
    }
    function setTokenAddress(address token_) public onlyOwner {
        require(token_.code.length > 0, "Token must be a contract");
        tokenAddress = token_;
        emit TokenAddressChanged(token_);
    }
    function setThreshold(uint256 threshold_) public onlyOwner {
        threshold = threshold_;
        emit ThresholdChanged(threshold_);
    }
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: zero address");
        address previous = owner;
        owner = newOwner;
        emit OwnershipTransferred(previous, newOwner);
    }
}
