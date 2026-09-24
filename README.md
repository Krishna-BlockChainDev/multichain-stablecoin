# Smart Contracts Deployment Guide

This repository is built using [Hardhat](https://hardhat.org/) and contains the ERC20 smart contracts and deployment scripts for all EVM compatible blockchain networks.

---

## Table of Contents

- [Overview](#overview)
- [Smart Contracts](#smart-contracts)
  - [ERC20F](#erc20f)
  - [UUPS Proxy](#uups-proxy)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Compile](#compile)
  - [Deploy](#deploy)
  - [Verify](#verify)
- [Multichain Deployment](#multichain-deployment)
  - [Supported Networks](#supported-networks)
- [Deployed Contract](#deployed-contract)

---

## Overview

This Smart Contracts repository includes upgradeable templates for issuing and managing fungible Tokens. It uses the [UUPS proxy pattern](https://eips.ethereum.org/EIPS/eip-1822) for upgrades, maintaining state and functionality while enabling improvements over time.

## Smart Contracts

### [ERC20F](./contracts/ERC20F.sol)

An upgradeable ERC-20 token template for:

- Serving as a unit of account
- Issuing stablecoins or CBDCs
- Supporting tokenized fundraising
- Recovering funds from blacklisted accounts
- Integration with Fireblocks ERC-20F, ERC-721F, and ERC-1155F contracts
- Shared usage across multiple token contracts
- Upgradeability via the UUPS proxy pattern

### [UUPS Proxy](./contracts/library/Proxy/Proxy.sol)

Provides upgradeable functionality for all smart contracts using the UUPS proxy pattern, ensuring flexibility and forward compatibility.

## Getting Started

### Prerequisites

1. Install [Node.js](https://nodejs.org/).

### Setup

Clone the repository and install dependencies.
Create and update the `.env` (see [`.env.sample`](./.env.sample)) file with your private key and contract owner/minter/pauser address.

```bash
PRIVATE_KEY=<your_private_key>
DEFAULT_ADMIN_ADDRESS=<admin_address>
MINTER_ADDRESS=<minter_address>
PAUSER_ADDRESS=<pauser_address>
NAME=<token_name>
SYMBOL=<token_symbol>
```

```bash
npm install
```

### Compile

```bash
npx hardhat compile
```

### Deploy

```bash
npm run deploy:<network_name>
```

### Verify

Verify, don't trust. Always make sure your deployed bytecode matches the bytecode in the [artifacts](./artifacts/) directory.

```bash
npm run verify:<network_name> <Implementation_contract_address>
```

---

## Multichain Deployment

This project supports deployment across multiple **Ethereum-compatible (EVM)** chains. Each network requires its own RPC endpoint configured in the `.env` file, and an optional block explorer API key for contract verification.

### Supported Networks

| Network                     | Chain ID   | Type    | Explorer                                                                             |
| --------------------------- | ---------- | ------- | ------------------------------------------------------------------------------------ |
| **Ethereum Mainnet**        | 1          | Mainnet | [etherscan.io](https://etherscan.io)                                                 |
| **Ethereum Sepolia**        | 11155111   | Testnet | [sepolia.etherscan.io](https://sepolia.etherscan.io)                                 |
| **BNB Smart Chain**         | 56         | Mainnet | [bscscan.com](https://bscscan.com)                                                   |
| **BNB Smart Chain Testnet** | 97         | Testnet | [testnet.bscscan.com](https://testnet.bscscan.com)                                   |
| **Avalanche C-Chain**       | 43114      | Mainnet | [snowtrace.io](https://snowtrace.io)                                                 |
| **Avalanche Fuji**          | 43113      | Testnet | [testnet.snowtrace.io](https://testnet.snowtrace.io)                                 |
| **Polygon**                 | 137        | Mainnet | [polygonscan.com](https://polygonscan.com)                                           |
| **Polygon Amoy**            | 80002      | Testnet | [amoy.polygonscan.com](https://amoy.polygonscan.com)                                 |
| **Fantom Opera**            | 250        | Mainnet | [ftmscan.com](https://ftmscan.com)                                                   |
| **Fantom Testnet**          | 4002       | Testnet | [testnet.ftmscan.com](https://testnet.ftmscan.com)                                   |
| **Celo**                    | 42220      | Mainnet | [celoscan.io](https://celoscan.io)                                                   |
| **Celo Alfajores**          | 44787      | Testnet | [alfajores.celoscan.io](https://alfajores.celoscan.io)                               |
| **Moonriver**               | 1285       | Mainnet | [moonriver.moonscan.io](https://moonriver.moonscan.io)                               |
| **Moonbeam**                | 1284       | Mainnet | [moonscan.io](https://moonscan.io)                                                   |
| **Moonbase Alpha**          | 1287       | Testnet | [moonbase.moonscan.io](https://moonbase.moonscan.io)                                 |
| **Hedera Mainnet**          | 295        | Mainnet | [hashscan.io](https://hashscan.io)                                                   |
| **Hedera Testnet**          | 296        | Testnet | [hashscan.io/testnet](https://hashscan.io/testnet)                                   |
| **Cronos Mainnet**          | 25         | Mainnet | [cronoscan.com](https://cronoscan.com)                                               |
| **Cronos Testnet**          | 338        | Testnet | [cronos.org/explorer/testnet3](https://cronos.org/explorer/testnet3)                 |
| **Evmos Mainnet**           | 9001       | Mainnet | [escan.live](https://escan.live)                                                     |
| **Evmos Testnet**           | 9000       | Testnet | [testnet.escan.live](https://testnet.escan.live)                                     |
| **Aurora Mainnet**          | 1313161554 | Mainnet | [aurorascan.dev](https://aurorascan.dev)                                             |
| **Aurora Testnet**          | 1313161555 | Testnet | [testnet.aurorascan.dev](https://testnet.aurorascan.dev)                             |
| **EOS EVM Mainnet**         | 17777      | Mainnet | [explorer.evm.eosnetwork.com](https://explorer.evm.eosnetwork.com)                   |
| **EOS EVM Testnet**         | 15557      | Testnet | [explorer.testnet.evm.eosnetwork.com](https://explorer.testnet.evm.eosnetwork.com)   |
| **Shimmer Mainnet**         | 148        | Mainnet | [explorer.evm.shimmer.network](https://explorer.evm.shimmer.network)                 |
| **Shimmer Testnet**         | 1074       | Testnet | [explorer.evm.testnet.shimmer.network](https://explorer.evm.testnet.shimmer.network) |
| **Theta Mainnet**           | 361        | Mainnet | [explorer.thetatoken.org](https://explorer.thetatoken.org)                           |
| **Theta Testnet**           | 365        | Testnet | [testnet-explorer.thetatoken.org](https://testnet-explorer.thetatoken.org)           |
| **Harmony Mainnet**         | 1666600000 | Mainnet | [explorer.harmony.one](https://explorer.harmony.one)                                 |
| **Harmony Testnet**         | 1666700000 | Testnet | [explorer.testnet.harmony.one](https://explorer.testnet.harmony.one)                 |

---

### Deploy on Ethereum Compatible Chains

Configure the corresponding RPC URL(s) in your `.env` file before deploying. Add only the networks you intend to use.

```bash
# Ethereum
ETHEREUM_MAINNET_RPC=https://mainnet.infura.io/v3/<your_infura_key>
ETHEREUM_SEPOLIA_RPC=https://sepolia.infura.io/v3/<your_infura_key>

# BNB Smart Chain
BSC_MAINNET_RPC=https://bsc-dataseed.binance.org/
BSC_TESTNET_RPC=https://data-seed-prebsc-1-s1.binance.org:8545/

# Avalanche
AVALANCHE_MAINNET_RPC=https://api.avax.network/ext/bc/C/rpc
AVALANCHE_FUJI_RPC=https://api.avax-test.network/ext/bc/C/rpc

# Polygon
POLYGON_MAINNET_RPC=https://polygon-rpc.com/
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology/

# Fantom
FANTOM_MAINNET_RPC=https://rpc.ftm.tools/
FANTOM_TESTNET_RPC=https://rpc.testnet.fantom.network/

# Celo
CELO_MAINNET_RPC=https://forno.celo.org
CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org

# Moonriver / Moonbeam / Moonbase Alpha
MOONRIVER_RPC=https://rpc.api.moonriver.moonbeam.network
MOONBEAM_RPC=https://rpc.api.moonbeam.network
MOONBASE_ALPHA_RPC=https://rpc.api.moonbase.moonbeam.network

# Hedera
HEDERA_MAINNET_RPC=https://mainnet.hashio.io/api
HEDERA_TESTNET_RPC=https://testnet.hashio.io/api

# Cronos
CRONOS_MAINNET_RPC=https://evm.cronos.org
CRONOS_TESTNET_RPC=https://evm-t3.cronos.org

# Evmos
EVMOS_MAINNET_RPC=https://eth.bd.evmos.org:8545
EVMOS_TESTNET_RPC=https://eth.bd.evmos.dev:8545

# Aurora
AURORA_MAINNET_RPC=https://mainnet.aurora.dev
AURORA_TESTNET_RPC=https://testnet.aurora.dev

# EOS EVM
EOS_MAINNET_RPC=https://api.evm.eosnetwork.com
EOS_TESTNET_RPC=https://api.testnet.evm.eosnetwork.com

# Shimmer
SHIMMER_MAINNET_RPC=https://json-rpc.evm.shimmer.network
SHIMMER_TESTNET_RPC=https://json-rpc.evm.testnet.shimmer.network

# Theta
THETA_MAINNET_RPC=https://eth-rpc-api.thetatoken.org/rpc
THETA_TESTNET_RPC=https://eth-rpc-api-testnet.thetatoken.org/rpc

# Harmony
HARMONY_MAINNET_RPC=https://api.harmony.one
HARMONY_TESTNET_RPC=https://api.s0.b.hmny.io
```

Run the deploy command with the target network name:

```bash
# Ethereum
npm run deploy:mainnet
npm run deploy:sepolia

# BNB Smart Chain
npm run deploy:bsc
npm run deploy:bsctestnet

# Avalanche
npm run deploy:avalanche
npm run deploy:avalancheFuji

# Polygon
npm run deploy:polygon
npm run deploy:polygonAmoy

# Fantom
npm run deploy:fantom
npm run deploy:fantomTestnet

# Celo
npm run deploy:celo
npm run deploy:celoAlfajores
```

> **Note:** For networks not listed in `package.json` scripts (Moonbeam, Hedera, Cronos, Evmos, Aurora, EOS, Shimmer, Theta, Harmony), deploy directly using Hardhat:
>
> ```bash
> npx hardhat run scripts/deploy.ts --network <network_name>
> ```
>
> Replace `<network_name>` with any network key defined in [`hardhat.config.ts`](./hardhat.config.ts).

---

### Verify on Ethereum Compatible Chains

Set the appropriate block explorer API key in your `.env` file:

```bash
ETHERSCAN_API_KEY=<your_etherscan_api_key>
BSCSCAN_API_KEY=<your_bscscan_api_key>
AVALANCHESCAN_API_KEY=<your_snowtrace_api_key>
POLYGONSCAN_API_KEY=<your_polygonscan_api_key>
FANTOMSCAN_API_KEY=<your_ftmscan_api_key>
CELOSCAN_API_KEY=<your_celoscan_api_key>
```

Run the verify command with the target network and implementation contract address:

```bash
# Ethereum
npm run verify:mainnet <Implementation_contract_address>
npm run verify:sepolia <Implementation_contract_address>

# BNB Smart Chain
npm run verify:bsc <Implementation_contract_address>
npm run verify:bsctestnet <Implementation_contract_address>

# Avalanche
npm run verify:avalanche <Implementation_contract_address>
npm run verify:avalancheFuji <Implementation_contract_address>

# Polygon
npm run verify:polygon <Implementation_contract_address>
npm run verify:polygonAmoy <Implementation_contract_address>

# Fantom
npm run verify:fantom <Implementation_contract_address>
npm run verify:fantomTestnet <Implementation_contract_address>

# Celo
npm run verify:celo <Implementation_contract_address>
npm run verify:celoAlfajores <Implementation_contract_address>
```

> **Note:** For networks without native Etherscan-compatible explorers, contract source verification is supported via [Sourcify](https://sourcify.dev/), which is enabled by default in [`hardhat.config.ts`](./hardhat.config.ts).

---

## Deployed Contract

```bash
BscTestnet > https://testnet.bscscan.com/address/0x59988e2e9f0a90b6a3a1328ec601a0866fb62890
```
