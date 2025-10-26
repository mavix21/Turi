"use client";

import { useAccount } from "wagmi";

export default function TestPage() {
  const { address, chainId, isConnected } = useAccount();

  return (
    <div>
      <h1>Test Page</h1>
      <p>Address: {address}</p>
      <p>Chain ID: {chainId}</p>
      <p>Connected: {isConnected ? "Yes" : "No"}</p>
    </div>
  );
}
