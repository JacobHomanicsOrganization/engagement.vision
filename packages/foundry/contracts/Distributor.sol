//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "forge-std/console.sol";

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {Token} from "./Token.sol";

contract Distributor {
    // ERC20 token;
    Token token;

    constructor() {}

    uint256 amount;

    function distribute(address target) external {
        token.mint(target, amount);
    }
}
