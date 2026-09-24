import { ethers, upgrades } from 'hardhat';
import { expect } from 'chai';

describe('ERC20F - recoverTokens', function () {
	let token: any;
	let owner: any, minter: any, pauser: any, recoveryAdmin: any, user: any;
	const name = 'USD one';
	const symbol = 'USD1';
	const amount = ethers.parseEther('100');

	beforeEach(async function () {
		[owner, minter, pauser, recoveryAdmin, user] = await ethers.getSigners();

		const ERC20F = await ethers.getContractFactory('ERC20F');
		token = await upgrades.deployProxy(ERC20F, [name, symbol, owner.address, minter.address, pauser.address], {
			initializer: 'initialize',
		});
		await token.waitForDeployment();

		await token.connect(minter).mint(user.address, amount);

		// Deploy mock registry
		const Registry = await ethers.getContractFactory('MockAccessRegistry');
		const accessRegistry = await Registry.deploy();
		await accessRegistry.waitForDeployment();
		this.accessRegistry = accessRegistry;

		await token.connect(owner).grantRole(await token.CONTRACT_ADMIN_ROLE(), owner.address);
		await token.connect(owner).accessRegistryUpdate(await accessRegistry.getAddress());
		await token.connect(owner).grantRole(await token.RECOVERY_ROLE(), recoveryAdmin.address);
	});

	it('should recover tokens if caller has RECOVERY_ROLE and target has no active access', async function () {
		const balanceBefore = await token.balanceOf(recoveryAdmin.address);

		const tx = await token.connect(recoveryAdmin).recoverTokens(user.address, amount);

		await expect(tx).to.emit(token, 'TokensRecovered').withArgs(recoveryAdmin.address, user.address, amount);

		expect(await token.balanceOf(user.address)).to.equal(0);
		expect(await token.balanceOf(recoveryAdmin.address)).to.equal(balanceBefore + amount);
	});

	it('should revert if caller lacks RECOVERY_ROLE', async function () {
		await expect(token.connect(user).recoverTokens(user.address, amount)).to.be.revertedWith(
			`AccessControl: account ${user.address.toLowerCase()} is missing role ${await token.RECOVERY_ROLE()}`
		);
	});

	it('should revert if amount is 0', async function () {
		await expect(token.connect(recoveryAdmin).recoverTokens(user.address, 0)).to.be.revertedWithCustomError(
			token,
			'ZeroAmount'
		);
	});

	it('should revert if accessRegistry is not set', async function () {
		await token.connect(owner).accessRegistryUpdate(ethers.ZeroAddress);

		await expect(token.connect(recoveryAdmin).recoverTokens(user.address, amount)).to.be.revertedWithCustomError(
			token,
			'AccessRegistryNotSet'
		);
	});

	it('should revert if user has active access', async function () {
		await this.accessRegistry.setActive(true);

		await expect(token.connect(recoveryAdmin).recoverTokens(user.address, amount)).to.be.revertedWithCustomError(
			token,
			'RecoveryOnActiveAccount'
		);
	});

	it('should revert if amount exceeds user\'s balance', async function () {
		const overAmount = amount + ethers.parseEther('1');
		await expect(token.connect(recoveryAdmin).recoverTokens(user.address, overAmount)).to.be.revertedWith(
			'ERC20: transfer amount exceeds balance'
		);
	});

	it('should revert if contract is paused', async function () {
		await token.grantRole(await token.PAUSER_ROLE(), pauser.address);
		await token.connect(pauser).pause();

		await expect(token.connect(recoveryAdmin).recoverTokens(user.address, amount)).to.be.revertedWith(
			'Pausable: paused'
		);
	});

	it('should revert if recovering from zero address', async function () {
		await expect(token.connect(recoveryAdmin).recoverTokens(ethers.ZeroAddress, amount)).to.be.revertedWith(
			'ERC20: transfer from the zero address'
		);
	});
});
