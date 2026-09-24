import { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';

describe('ERC20F - PausableUpgradeable', function () {
	let ERC20F: any;
	let token: any;
	let owner: any, minter: any, pauser: any, dummyAccount: any, burner: any, spender: any;
	const name = 'USD one';
	const symbol = 'USD1';
	const mintAmount = ethers.parseUnits('500', 18);
	const transferAmount = ethers.parseUnits('100', 18);

	beforeEach(async function () {
		[owner, minter, burner, spender, dummyAccount, pauser] = await ethers.getSigners();

		ERC20F = await ethers.getContractFactory('ERC20F');
		token = await upgrades.deployProxy(ERC20F, [name, symbol, owner.address, minter.address, pauser.address], {
			initializer: 'initialize',
		});

		await token.grantRole(await token.MINTER_ROLE(), minter.address);
		await token.grantRole(await token.PAUSER_ROLE(), pauser.address);

		await token.connect(minter).mint(owner.address, mintAmount);
		await token.connect(owner).approve(spender.address, transferAmount);
	});

	describe('transfer', function () {
		it('allows to transfer when unpaused', async function () {
			await token.connect(owner).transfer(spender.address, transferAmount);
			expect(await token.balanceOf(spender.address)).to.equal(transferAmount);
		});

		it('allows to transfer when paused and then unpaused', async function () {
			await token.connect(pauser).pause();
			await token.connect(pauser).unpause();
			await token.connect(owner).transfer(spender.address, transferAmount);
			expect(await token.balanceOf(spender.address)).to.equal(transferAmount);
		});

		it('reverts when trying to transfer when paused', async function () {
			await token.connect(pauser).pause();
			await expect(token.connect(owner).transfer(spender.address, transferAmount)).to.be.revertedWith(
				'Pausable: paused'
			);
		});
	});

	describe('transfer from', function () {
		it('allows to transfer from when unpaused', async function () {
			await token.connect(spender).transferFrom(owner.address, dummyAccount.address, transferAmount);
			expect(await token.balanceOf(dummyAccount.address)).to.equal(transferAmount);
		});

		it('allows to transfer from when paused and then unpaused', async function () {
			await token.connect(pauser).pause();
			await token.connect(pauser).unpause();
			await token.connect(spender).transferFrom(owner.address, dummyAccount.address, transferAmount);
			expect(await token.balanceOf(dummyAccount.address)).to.equal(transferAmount);
		});

		it('reverts when trying to transfer from when paused', async function () {
			await token.connect(pauser).pause();
			await expect(
				token.connect(spender).transferFrom(owner.address, dummyAccount.address, transferAmount)
			).to.be.revertedWith('Pausable: paused');
		});
	});

	describe('mint', function () {
		it('allows to mint when unpaused', async function () {
			await token.connect(minter).mint(dummyAccount.address, transferAmount);
			expect(await token.balanceOf(dummyAccount.address)).to.equal(transferAmount);
		});

		it('allows to mint when paused and then unpaused', async function () {
			await token.connect(pauser).pause();
			await token.connect(pauser).unpause();
			await token.connect(minter).mint(dummyAccount.address, transferAmount);
			expect(await token.balanceOf(dummyAccount.address)).to.equal(transferAmount);
		});

		it('reverts when trying to mint when paused', async function () {
			await token.connect(pauser).pause();
			await expect(token.connect(minter).mint(dummyAccount.address, transferAmount)).to.be.revertedWith(
				'Pausable: paused'
			);
		});
	});

	describe('burn', function () {
		beforeEach(async function () {
			await token.connect(owner).grantRole(await token.BURNER_ROLE(), burner.address);
			await token.connect(minter).mint(burner.address, transferAmount);
		});
		it('allows to burn when unpaused', async function () {
			await token.connect(burner).burn(transferAmount);
			expect(await token.balanceOf(burner.address)).to.equal(0n);
		});

		it('allows to burn when paused and then unpaused', async function () {
			await token.connect(pauser).pause();
			await token.connect(pauser).unpause();
			await token.connect(burner).burn(transferAmount);
			expect(await token.balanceOf(burner.address)).to.equal(0n);
		});

		it('reverts when trying to burn when paused', async function () {
			await token.connect(pauser).pause();
			await expect(token.connect(burner).burn(transferAmount)).to.be.revertedWith('Pausable: paused');
		});
	});
});
