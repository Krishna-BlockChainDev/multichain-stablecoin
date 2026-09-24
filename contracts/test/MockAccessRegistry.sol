// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {IAccessRegistry} from "../library/AccessRegistry/interface/IAccessRegistry.sol"; 
import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

contract MockAccessRegistry is IAccessRegistry, ERC165 {
	bool private _active = false;

	function setActive(bool active) external {
		_active = active;
	}

	function hasAccess(address, address, bytes calldata) external view override returns (bool) {
		return _active;
	}

	function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
		return interfaceId == type(IAccessRegistry).interfaceId || super.supportsInterface(interfaceId);
	}
}
