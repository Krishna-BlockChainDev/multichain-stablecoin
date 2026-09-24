import { HardhatUserConfig } from 'hardhat/config';
import '@openzeppelin/hardhat-upgrades';
import '@nomicfoundation/hardhat-verify';
import 'dotenv/config';
import '@nomicfoundation/hardhat-chai-matchers';
import '@fireblocks/hardhat-fireblocks';
import { ApiBaseUrl } from '@fireblocks/fireblocks-web3-provider';

const privateKey: string = process.env.PRIVATE_KEY || '01234567890123456789';

const config: HardhatUserConfig = {
	defaultNetwork: 'hardhat',
	networks: {
		hardhat: {
			chainId: 1337,
		},

		// Ethereum
		mainnet: {
			url: process.env.ETHEREUM_MAINNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 1,
		},
		sepolia: {
			url: process.env.ETHEREUM_SEPOLIA_RPC || '',
			//accounts: privateKey ? [privateKey] : [],
			fireblocks: {
				apiBaseUrl: ApiBaseUrl.Sandbox, // Only use in a Sandbox workspace
				privateKey: process.env.FIREBLOCKS_API_PRIVATE_KEY || '',
				apiKey: process.env.FIREBLOCKS_API_KEY || '',
				vaultAccountIds: process.env.FIREBLOCKS_VAULT_ACCOUNT_IDS,
			},
			chainId: 11155111,
		},

		//Binance Smart Chain (BSC)
		bsc: {
			url: process.env.BSC_MAINNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 56,
		},
		bsctestnet: {
			url: process.env.BSC_TESTNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 97,
		},

		// Avalanche
		avalanche: {
			url: process.env.AVALANCHE_MAINNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 43114,
		},
		avalancheFuji: {
			url: process.env.AVALANCHE_FUJI_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 43113,
		},

		// Polygon
		polygon: {
			url: process.env.POLYGON_MAINNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 137,
		},
		polygonAmoy: {
			url: process.env.POLYGON_AMOY_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 80002,
		},

		// Fantom
		fantom: {
			url: process.env.FANTOM_MAINNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 250,
		},
		fantomTestnet: {
			url: process.env.FANTOM_TESTNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 4002,
		},

		// Celo
		celo: {
			url: process.env.CELO_MAINNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 42220,
		},
		celoAlfajores: {
			url: process.env.CELO_ALFAJORES_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 44787,
		},

		// Moonriver
		moonriver: {
			url: process.env.MOONRIVER_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 1285,
		},

		// Moonbeam Mainnet(Polkadot parachains)
		moonbeam: {
			url: process.env.MOONBEAM_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 1284,
		},

		// Moonbase Alpha (Testnet - Polkadot parachains)
		moonbaseAlpha: {
			url: process.env.MOONBASE_ALPHA_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 1287,
		},

		// Hedera Hashgraph
		hederaMainnet: {
			url: process.env.HEDERA_MAINNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 295,
		},

		hederaTestnet: {
			url: process.env.HEDERA_TESTNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 296,
		},

		// Cronos (Cosmos SDK EVM)
		cronosMainnet: {
			url: process.env.CRONOS_MAINNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 25,
		},

		cronosTestnet: {
			url: process.env.CRONOS_TESTNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 338,
		},

		// Evmos (Cosmos SDK EVM)
		evmosMainnet: {
			url: process.env.EVMOS_MAINNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 9001,
		},

		evmosTestnet: {
			url: process.env.EVMOS_TESTNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 9000,
		},

		// Aurora (on NEAR)
		auroraMainnet: {
			url: process.env.AURORA_MAINNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 1313161554,
		},

		auroraTestnet: {
			url: process.env.AURORA_TESTNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 1313161555,
		},

		// EOS EVM
		eosMainnet: {
			url: process.env.EOS_MAINNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 17777,
		},

		eosTestnet: {
			url: process.env.EOS_TESTNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 15557,
		},

		// Shimmer (IOTA)
		shimmerMainnet: {
			url: process.env.SHIMMER_MAINNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 148,
		},

		shimmerTestnet: {
			url: process.env.SHIMMER_TESTNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 1074,
		},

		// Theta Network
		theta: {
			url: process.env.THETA_MAINNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 361,
		},
		thetaTestnet: {
			url: process.env.THETA_TESTNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 365,
		},

		// Harmony
		harmony: {
			url: process.env.HARMONY_MAINNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 1666600000,
		},
		harmonyTestnet: {
			url: process.env.HARMONY_TESTNET_RPC || '',
			accounts: privateKey ? [privateKey] : [],
			chainId: 1666700000,
		},
	},

	sourcify: {
		enabled: true,
	},

	etherscan: {
		apiKey: {
			mainnet: process.env.ETHERSCAN_API_KEY || '',
			sepolia: process.env.ETHERSCAN_API_KEY || '',
			bsc: process.env.BSCSCAN_API_KEY || '',
			bscTestnet: process.env.BSCSCAN_API_KEY || '',
			avalanche: process.env.AVALANCHESCAN_API_KEY || '',
			avalancheFuji: process.env.AVALANCHESCAN_API_KEY || '',
			polygon: process.env.POLYGONSCAN_API_KEY || '',
			polygonAmoy: process.env.POLYGONSCAN_API_KEY || '',
			fantom: process.env.FANTOMSCAN_API_KEY || '',
			fantomTestnet: process.env.FANTOMSCAN_API_KEY || '',
			celo: process.env.CELOSCAN_API_KEY || '',
			celoAlfajores: process.env.CELOSCAN_API_KEY || '',
		},
	},

	solidity: {
		compilers: [
			{
				version: '0.8.20',
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
			{
				version: '0.8.22',
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
		],
	},
};

export default config;
