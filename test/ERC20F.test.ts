import { ethers, upgrades } from 'hardhat';
import { expect } from 'chai';
const { constants } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;
import '@nomicfoundation/hardhat-chai-matchers';

describe('ERC20F - Upgradeable ERC20', function () {
	let ERC20F: any;
	let token: any;
	let owner: any, minter: any, pauser: any, recipient: any, dummyAccount: any, burner: any, spender: any;

	const name = 'USD one';
	const symbol = 'USD1';
	beforeEach(async function () {
		[owner, minter, pauser, recipient, dummyAccount, burner, spender] = await ethers.getSigners();

		ERC20F = await ethers.getContractFactory('ERC20F');
		token = await upgrades.deployProxy(ERC20F, [name, symbol, owner.address, minter.address, pauser.address], {
			initializer: 'initialize',
		});

		await token.connect(owner).grantRole(await token.BURNER_ROLE(), burner.address);
	});

	it('should initialize with correct name and symbol', async function () {
		expect(await token.name()).to.equal(name);
		expect(await token.symbol()).to.equal(symbol);
	});

	it('should have 18 decimals', async function () {
		expect(Number(await token.decimals())).to.equal(18);
	});

	it('should assign roles correctly', async function () {
		expect(await token.hasRole(await token.DEFAULT_ADMIN_ROLE(), owner.address)).to.be.true;
		expect(await token.hasRole(await token.MINTER_ROLE(), minter.address)).to.be.true;
		expect(await token.hasRole(await token.PAUSER_ROLE(), pauser.address)).to.be.true;
		expect(await token.hasRole(await token.BURNER_ROLE(), burner.address)).to.be.true;
	});

	// Minting Tests
	describe('_mint', function () {
		const mintAmount = ethers.parseEther('500');
		let initialSupply: any;

		beforeEach(async function () {
			initialSupply = await token.totalSupply();
			await token.connect(minter).mint(recipient.address, mintAmount);
		});

		it('should allow minter to mint tokens', async function () {
			const minterRole = await token.MINTER_ROLE();
			expect(await token.hasRole(minterRole, minter.address)).to.be.true;
		});

		it('increments recipient balance', async function () {
			expect(await token.balanceOf(recipient.address)).to.equal(mintAmount);
		});

		it('increments totalSupply', async function () {
			const expectedSupply = initialSupply + mintAmount;
			expect(await token.totalSupply()).to.equal(expectedSupply);
		});
		it('emits Transfer event', async function () {
			await expect(token.connect(minter).mint(recipient.address, mintAmount))
				.to.emit(token, 'Transfer')
				.withArgs(ethers.ZeroAddress, recipient.address, mintAmount);
		});
		it('rejects a null account', async function () {
			await expect(token.connect(minter).mint(ZERO_ADDRESS, mintAmount)).to.be.revertedWith(
				'ERC20: mint to the zero address'
			);
		});

		it('should not allow non-minter to mint', async function () {
			await expect(token.connect(dummyAccount).mint(recipient.address, mintAmount)).to.be.revertedWith(
				`AccessControl: account ${dummyAccount.address.toLowerCase()} is missing role ${await token.MINTER_ROLE()}`
			);
		});
	});

	// Transfer Tests
	describe('_transfer', function () {
		const mintAmount = ethers.parseEther('500');
		const transferAmount = ethers.parseEther('200');

		beforeEach(async function () {
			await token.connect(minter).mint(recipient.address, mintAmount);
		});

		describe('when the recipient is not the zero address', function () {
			describe('when the sender does not have enough balance', function () {
				it('reverts', async function () {
					await expect(token.connect(dummyAccount).transfer(recipient.address, mintAmount)).to.be.revertedWith(
						'ERC20: transfer amount exceeds balance'
					);
				});
			});

			describe('when the sender transfers all balance', function () {
				it('transfers the requested amount', async function () {
					await token.connect(recipient).transfer(dummyAccount.address, mintAmount);
					expect(await token.balanceOf(dummyAccount.address)).to.equal(mintAmount);
				});

				it('emits a transfer event', async function () {
					await expect(token.connect(recipient).transfer(dummyAccount.address, mintAmount))
						.to.emit(token, 'Transfer')
						.withArgs(recipient.address, dummyAccount.address, mintAmount);
				});
			});

			describe('when the sender transfers zero tokens', function () {
				it('transfers the requested amount', async function () {
					await token.connect(recipient).transfer(dummyAccount.address, 0);
					expect(await token.balanceOf(dummyAccount.address)).to.equal(0);
				});

				it('emits a transfer event', async function () {
					await expect(token.connect(recipient).transfer(dummyAccount.address, 0))
						.to.emit(token, 'Transfer')
						.withArgs(recipient.address, dummyAccount.address, 0);
				});
			});
		});

		describe('when the recipient is the zero address', function () {
			it('should revert the transfer', async function () {
				await expect(token.connect(recipient).transfer(ZERO_ADDRESS, transferAmount)).to.be.revertedWith(
					'ERC20: transfer to the zero address'
				);
			});
		});
	});

	// Burning Tests
	describe('_burn', function () {
		const mintAmount = ethers.parseEther('500');
		const burnAmount = ethers.parseEther('200');

		beforeEach(async function () {
			await token.connect(minter).mint(burner.address, mintAmount);
		});

		describe('for a non zero account', function () {
			it('rejects burning more than balance', async function () {
				const excessiveAmount = ethers.parseEther('1000');
				await expect(token.connect(burner).burn(excessiveAmount)).to.be.revertedWith(
					'ERC20: burn amount exceeds balance'
				);
			});

			describe('for entire balance', function () {
				beforeEach(async function () {
					await token.connect(burner).burn(mintAmount);
				});

				it('decrements totalSupply', async function () {
					expect(await token.totalSupply()).to.equal(0n);
				});

				it('decrements initialHolder balance', async function () {
					expect(await token.balanceOf(burner.address)).to.equal(0n);
				});

				it('emits Transfer event', async function () {
					await token.connect(minter).mint(burner.address, mintAmount);
					await expect(token.connect(burner).burn(mintAmount))
						.to.emit(token, 'Transfer')
						.withArgs(burner.address, ethers.ZeroAddress, mintAmount);
				});
			});

			describe('for less amount than balance', function () {
				beforeEach(async function () {
					await token.connect(burner).burn(burnAmount);
				});

				it('decrements totalSupply', async function () {
					const expectedSupply = mintAmount - burnAmount;
					expect(await token.totalSupply()).to.equal(expectedSupply);
				});

				it('decrements initialHolder balance', async function () {
					const expectedBalance = mintAmount - burnAmount;
					expect(await token.balanceOf(burner.address)).to.equal(expectedBalance);
				});

				it('emits Transfer event', async function () {
					await expect(token.connect(minter).mint(burner.address, burnAmount))
						.to.emit(token, 'Transfer')
						.withArgs(ethers.ZeroAddress, burner.address, burnAmount);
					await expect(token.connect(burner).burn(burnAmount))
						.to.emit(token, 'Transfer')
						.withArgs(burner.address, ethers.ZeroAddress, burnAmount);
				});
			});
		});
	});

	//Approve Tests
	describe('_approve', function () {
		const approveAmount = ethers.parseEther('100');
		const newApproveAmount = ethers.parseEther('200');

		beforeEach(async function () {
			await token.connect(minter).mint(owner.address, ethers.parseEther('1000'));
		});

		describe('when the spender is not the zero address', function () {
			describe('when the owner has enough balance', function () {
				it('emits an approval event', async function () {
					await expect(token.connect(owner).approve(spender.address, approveAmount))
						.to.emit(token, 'Approval')
						.withArgs(owner.address, spender.address, approveAmount);
				});

				describe('when there was no approved amount before', function () {
					beforeEach(async function () {
						await token.connect(owner).approve(spender.address, approveAmount);
					});

					it('approves the requested amount', async function () {
						expect(await token.allowance(owner.address, spender.address)).to.equal(approveAmount);
					});
				});

				describe('when the spender had an approved amount', function () {
					beforeEach(async function () {
						await token.connect(owner).approve(spender.address, approveAmount);
						await token.connect(owner).approve(spender.address, newApproveAmount);
					});

					it('approves the requested amount and replaces the previous one', async function () {
						expect(await token.allowance(owner.address, spender.address)).to.equal(newApproveAmount);
					});
				});
			});

			describe('when the owner does not have enough balance', function () {
				it('still emits an approval event', async function () {
					await expect(token.connect(owner).approve(spender.address, ethers.parseEther('9999')))
						.to.emit(token, 'Approval')
						.withArgs(owner.address, spender.address, ethers.parseEther('9999'));
				});

				describe('when there was no approved amount before', function () {
					beforeEach(async function () {
						await token.connect(owner).approve(spender.address, approveAmount);
					});

					it('approves the requested amount', async function () {
						expect(await token.allowance(owner.address, spender.address)).to.equal(approveAmount);
					});
				});

				describe('when the spender had an approved amount', function () {
					beforeEach(async function () {
						await token.connect(owner).approve(spender.address, approveAmount);
						await token.connect(owner).approve(spender.address, newApproveAmount);
					});

					it('approves the requested amount and replaces the previous one', async function () {
						expect(await token.allowance(owner.address, spender.address)).to.equal(newApproveAmount);
					});
				});
			});
		});

		describe('when the spender is the zero address', function () {
			it('reverts', async function () {
				await expect(token.connect(owner).approve(ethers.ZeroAddress, approveAmount)).to.be.revertedWith(
					'ERC20: approve to the zero address'
				);
			});
		});
	});
});
