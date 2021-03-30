// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./common/ERC20Pausable.sol";
import "./common/Ownable.sol";

contract Token is ERC20Pausable, Ownable {
      constructor (
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public onlyOwner {
        _burn(from, amount);
    }
}