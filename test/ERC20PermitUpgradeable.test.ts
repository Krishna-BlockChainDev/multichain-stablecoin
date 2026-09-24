import { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { signERC2612Permit } from 'eth-permit';

describe('ERC20F - PermitUpgradeable', function () {
	let token: any;
	let owner: any, spender: any;
	const name = 'USD One';
	const symbol = 'USD1';
	const initialSupply = ethers.parseUnits('1000', 18);

	beforeEach(async function () {
		[owner, spender] = await ethers.getSigners();

		const ERC20 = await ethers.getContractFactory('ERC20F');
		token = await upgrades.deployProxy(ERC20, [name, symbol, owner.address, owner.address, owner.address], {
			initializer: 'initialize',
		});

		await token.connect(owner).mint(owner.address, initialSupply);
	});

	it('initial nonce is 0', async function () {
		expect(await token.nonces(owner.address)).to.equal(0);
	});

	it('domain separator', async function () {
		const chainId = await owner.provider.getNetwork().then((n: any) => n.chainId);
		const domainSeparator = await token.DOMAIN_SEPARATOR();
		const expected = ethers.keccak256(
			ethers.AbiCoder.defaultAbiCoder().encode(
				['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
				[
					ethers.id('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'),
					ethers.id(name),
					ethers.id('1'),
					chainId,
					token.target, // token Address
				]
			)
		);
		expect(domainSeparator).to.equal(expected);
	});

	describe('permit', function () {
		it('accepts owner signature', async function () {
			const deadline = Math.floor(Date.now() / 1000) + 3600;

			const { v, r, s } = await signERC2612Permit(
				owner.provider,
				token.target,
				owner.address,
				spender.address,
				ethers.parseUnits('100', 18).toString(),
				deadline
			);

			await token.permit(owner.address, spender.address, ethers.parseUnits('100', 18), deadline, v, r, s);

			expect(await token.allowance(owner.address, spender.address)).to.equal(ethers.parseUnits('100', 18));
		});

		it('rejects reused signature', async function () {
			const deadline = Math.floor(Date.now() / 1000) + 3600;
			const { v, r, s } = await signERC2612Permit(
				owner.provider,
				token.target,
				owner.address,
				spender.address,
				ethers.parseUnits('100', 18).toString(),
				deadline
			);

			await token.permit(owner.address, spender.address, ethers.parseUnits('100', 18), deadline, v, r, s);

			await expect(
				token.permit(owner.address, spender.address, ethers.parseUnits('100', 18), deadline, v, r, s)
			).to.be.revertedWith('ERC20Permit: invalid signature');
		});

		it('rejects other signature', async function () {
			const deadline = Math.floor(Date.now() / 1000) + 3600;
			const { v, r, s } = await signERC2612Permit(
				owner.provider,
				token.target,
				spender.address, // wrong spender
				owner.address,
				ethers.parseUnits('100', 18).toString(),
				deadline
			);

			await expect(
				token.permit(owner.address, spender.address, ethers.parseUnits('100', 18), deadline, v, r, s)
			).to.be.revertedWith('ERC20Permit: invalid signature');
		});

		it('rejects expired permit', async function () {
			const deadline = Math.floor(Date.now() / 1000) - 10;
			const { v, r, s } = await signERC2612Permit(
				owner.provider,
				token.target,
				owner.address,
				spender.address,
				ethers.parseUnits('100', 18).toString(),
				deadline
			);

			await expect(
				token.permit(owner.address, spender.address, ethers.parseUnits('100', 18), deadline, v, r, s)
			).to.be.revertedWith('ERC20Permit: expired deadline');
		});
	});
});
