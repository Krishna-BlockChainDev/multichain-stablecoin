import { ethers, upgrades } from 'hardhat';
import 'dotenv/config';

async function main() {
	const AllowList = await ethers.getContractFactory('AllowList');

	const allowListProxy = await upgrades.deployProxy(
		AllowList,
		[`${process.env.DEFAULT_ADMIN_ADDRESS}`, `${process.env.PAUSER_ADDRESS}`, `${process.env.UPGRADER_ADDRESS}`],
		{ kind: 'uups' }
	);

	await allowListProxy.waitForDeployment();

	console.log('AllowList contract deployed at:', await allowListProxy.getAddress());
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
