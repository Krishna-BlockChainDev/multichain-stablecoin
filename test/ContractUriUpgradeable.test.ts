import { ethers, upgrades } from 'hardhat';
import { expect } from 'chai';

describe('ERC20F - ContractUriUpgradeable', function () {
	let ERC20F: any;
	let token: any;
	let owner: any, minter: any, pauser: any;

	const name = 'USD one';
	const symbol = 'USD1';
	const newUri = 'ipfs://new-uri';

	beforeEach(async function () {
		[owner, minter, pauser] = await ethers.getSigners();

		ERC20F = await ethers.getContractFactory('ERC20F');
		token = await upgrades.deployProxy(ERC20F, [name, symbol, owner.address, minter.address, pauser.address], {
			initializer: 'initialize',
		});

		await token.waitForDeployment();
	});

	it('should have an empty initial contractUri', async function () {
		expect(await token.contractUri()).to.equal('');
	});

	it('should allow CONTRACT_ADMIN_ROLE to update contractUri', async function () {
		await token.connect(owner).grantRole(await token.CONTRACT_ADMIN_ROLE(), owner.address);

		const tx = await token.connect(owner).contractUriUpdate(newUri);

		await expect(tx).to.emit(token, 'ContractUriUpdated').withArgs(owner.address, '', newUri);

		expect(await token.contractUri()).to.equal(newUri);
	});
});
