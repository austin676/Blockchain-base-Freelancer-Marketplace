This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## 📦Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🛠️Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# 🌐Blockchain-based Freelancer Marketplace

This is a simplified freelancer hiring platform built using Ethereum, Ethers.js, Next.js, Ganache, and Sanity. The application enables clients to securely hire from a list of freelancers across various categories.

## Escrow Smart Contract:

Developed a Solidity smart contract to act as an escrow system.When a client clicks "Hire Now", a transaction is triggered through MetaMask.Funds are locked in the smart contract until the client approves project completion.On approval, the payment is released to the freelancer.

## Ganache for Local Testing:

Ran a local Ethereum blockchain using Ganache to test transactions and smart contract logic.

## 🔧Tech Stack
- Frontend: Next.js
- Smart Contracts: Solidity
- Blockchain: Ethereum (Ganache for local dev)
- Tools: Truffle, ethers.js

## 🚀Setup
1. Install dependencies:
```bash
   npm install
```
2.Start local blockchain:
```bash
ganache
```
3.Deploy contracts:
```bash
truffle migrate
```
4.Run frontend:
```bash
npm run dev
```
## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first.
