import { ethers, upgrades } from 'hardhat';
import { expect } from 'chai';

describe('ERC20F: Salvage', function () {
	let ERC20F: any;
	let token: any;
	let externalToken: any;
	let owner: any, minter: any, pauser: any, user: any;

	const name = 'USD one';
	const symbol = 'USD1';
	beforeEach(async () => {
		[owner, minter, pauser, user] = await ethers.getSigners();

		ERC20F = await ethers.getContractFactory('ERC20F');
		token = await upgrades.deployProxy(ERC20F, [name, symbol, owner.address, minter.address, pauser.address], {
			initializer: 'initialize',
		});

		const SALVAGE_ROLE = await token.SALVAGE_ROLE();
		await token.grantRole(SALVAGE_ROLE, owner.address);

		const ExternalTokenFactory = await ethers.getContractFactory('MockERC20');
		externalToken = await ExternalTokenFactory.deploy(owner.address, owner.address); // recipient, initialOwner
	});

	describe('salvageERC20', () => {
		it('allows authorized address to salvage ERC20 tokens', async () => {
			const amount = await externalToken.balanceOf(owner.address);

			await externalToken.transfer(token.target, amount);
			expect(await externalToken.balanceOf(token.target)).to.equal(amount);

			const tx = await token.salvageERC20(externalToken.target, amount);
			await expect(tx).to.emit(token, 'TokenSalvaged').withArgs(owner.address, externalToken.target, amount);

			expect(await externalToken.balanceOf(owner.address)).to.equal(amount);
		});

		it('reverts if caller is unauthorized', async () => {
			const amount = ethers.parseEther('10');
			await externalToken.transfer(token.target, amount);

			await expect(token.connect(user).salvageERC20(externalToken.target, amount)).to.be.revertedWith(
				`AccessControl: account ${user.address.toLowerCase()} is missing role ${await token.SALVAGE_ROLE()}`
			);
		});

		it('reverts if amount is zero', async () => {
			await expect(token.salvageERC20(externalToken.target, 0)).to.be.revertedWithCustomError(token, 'ZeroAmount');
		});
	});

	describe('salvageGas', () => {
		it('reverts if contract has no ETH to salvage', async () => {
			const amount = ethers.parseEther('1');

			const contractBalance = await ethers.provider.getBalance(token.target);
			expect(contractBalance).to.equal(0n);

			await expect(token.salvageGas(amount)).to.be.revertedWithCustomError(token, 'SalvageGasFailed');
		});

		it('reverts if amount is zero', async () => {
			await expect(token.salvageGas(0)).to.be.revertedWithCustomError(token, 'ZeroAmount');
		});
	});
});
