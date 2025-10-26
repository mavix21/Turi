````markdown
# Turi Passport

<p align="center">
  <img src="turi-logo.png" alt="Turi Logo" width="200"/>
</p>

Turi Passport is a web3 platform built on Scroll, designed to solve the trust and inefficiency gap in Peru's tourism sector by introducing a gamified digital passport where travelers build a verifiable on-chain reputation. By checking into verified locations, tourists earn reputation points and unique NFT postcards, which in turn unlock tangible benefits like discounts on tours and local crafts, payable with the USX stablecoin or our native Turi Token. This system simultaneously provides local artisans and formal businesses with a public reputation system and access to a low-cost digital payment ecosystem, fostering a transparent and sustainable tourism economy that rewards responsible travelers and empowers local communities.

## 📦 Monorepo Structure

This repository is a pnpm monorepo. It consists of the following main parts:

- `apps/web`: This is the main Next.js application. It contains all the user-facing pages, API routes, and application-specific logic.
- `packages/ui`: This package holds all the shared UI components, primarily built using shadcn/ui. These components are designed to be reusable across different parts of the application or even other applications within the monorepo in the future
- `packages/contracts`: This package contains the Foundry project for the smart contracts.
- `tooling/`: This directory contains configuration files for common development tools like ESLint, Prettier, TypeScript, etc., ensuring consistent code quality and development experience across the monorepo.

## 🧰 Tech Stack

- **Next.js 15 & Turbopack:** Modern, fast, and scalable React framework for the frontend.

- **Blockchain Integration (Web3):**
  - Utilizes OnchainKit, Wagmi, and Viem for connecting to and interacting with EVM-compatible blockchains.
  - Interacts with smart contracts deployed via the Foundry project in `packages/contracts`.
  - Supports "Sign-In with Ethereum" (SIWE) via `@reown/appkit-siwe`.

- **Convex Backend:** Reactive backend-as-a-service for data storage, server functions, and real-time updates.

- **User Authentication:** Robust authentication system using NextAuth.js (`@auth/core`, `next-auth`).

- **Rich Text Editing:** Includes a Tiptap-based rich text editor for content creation.

- **File Uploads & IPFS:** Supports file uploads with `react-dropzone`, using Pinata for decentralized storage on IPFS.

- **Internationalization (i18n):** Built with `next-intl` to support multiple languages.

- **Robust Form Handling:** Uses `react-hook-form` and `zod` for creating and validating forms.

- **Custom UI Library:** Leverages `@turi/ui` for a consistent look and feel, built with shadcn/ui components.

- **Server State Management:** Uses `@tanstack/react-query` for managing server state and caching.

- **Modern Tooling:** Includes ESLint, Prettier, TypeScript for code quality and development experience.

- ...and more!

## Smart Contract Addresses

The following contracts are deployed on the Scroll network:

| Contract        | Address                                      |
| --------------- | -------------------------------------------- |
| `USDX`          | `0xcdAc26a0D89A041Ba0034Dc056eD4Edb2Cc0298d` |
| `TravelToken`   | `0xB3B022fC6c73eA4683882cE0F6C3a686B1616aBa` |
| `PlaceNFT`      | `0xAC92D1dE90A040fB2df7d10A6fFF4d8B98e9cBc0` |
| `TravelCheckin` | `0x01Eec72cB36B6c3BD9Eb35277174799960c91B90` |
| `ProductVault`  | `0xb62EAA45FbF167D6F3f07Bf2B71E74aba40C6941` |

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (version specified in `.nvmrc` - make sure to use a Node version manager like nvm or fnm)
- pnpm (version specified in `package.json` under `packageManager`)
- Foundry

### Installation

1.  **Clone the repository:**

    ```bash
    git clone *repo-url*
    cd turi
    ```

2.  **Install dependencies:**
    This project uses pnpm workspaces. Install all dependencies from the root of the monorepo:

    ```bash
    pnpm install
    ```

3.  **Install smart contract dependencies:**
    Navigate to the contracts package and install the dependencies:
    ```bash
    cd packages/contracts
    forge install
    ```

### Environment Variables

The Next.js application in `apps/web` requires some environment variables to run correctly.

1.  Create a `.env.local` file by copying the example environment file

    ```bash
    cp .env.example .env.local
    ```

### Running the Development Server

1.  To start the development server for the Next.js web application from the root:

    ```bash
    pnpm dev
    ```

    The application should now be running on [http://localhost:3000](http://localhost:3000) (or the port specified in your Next.js configuration).
````
