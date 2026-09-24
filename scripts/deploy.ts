import { ethers, upgrades } from 'hardhat';
import 'dotenv/config';

async function main() {
	const erc20f: any = await ethers.getContractFactory('ERC20F');
	const erc20Coin: any = await upgrades.deployProxy(
		erc20f,
		[
			`${process.env.NAME}`,
			`${process.env.SYMBOL}`,
			`${process.env.DEFAULT_ADMIN_ADDRESS}`,
			`${process.env.MINTER_ADDRESS}`,
			`${process.env.PAUSER_ADDRESS}`,
		],
		{ kind: 'uups' }
	);
	await erc20Coin.waitForDeployment();

	console.log('ERC20F contract deployed to:', await erc20Coin.getAddress());
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
