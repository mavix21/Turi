"use client";

import { useAccount } from "wagmi";
import { FaucetButton } from "@/app/_components/faucet-button";

export default function TestPage() {
  const { address, chainId, isConnected } = useAccount();

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Test Page</h1>
          <p className="text-muted-foreground">
            Test blockchain integrations and get test tokens
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Wallet Info */}
          <div className="space-y-4">
            <div className="rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Wallet Info</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Status: </span>
                  <span className={isConnected ? "text-green-600" : "text-red-600"}>
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
                {isConnected && (
                  <>
                    <div>
                      <span className="text-muted-foreground">Address: </span>
                      <span className="font-mono text-xs">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Chain ID: </span>
                      <span>{chainId}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Network: </span>
                      <span>
                        {chainId === 534351 ? "Scroll Sepolia" :
                         chainId === 534352 ? "Scroll" :
                         "Unknown"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Faucet */}
          <div>
            <FaucetButton />
          </div>
        </div>

        {/* Contract Addresses */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Contract Addresses</h2>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">USDX Token:</span>
              <span className="font-mono text-xs">0xcdAc26a0D89A041Ba0034Dc056eD4Edb2Cc0298d</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Product Vault:</span>
              <span className="font-mono text-xs">0xb62EAA45FbF167D6F3f07Bf2B71E74aba40C6941</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Travel Token:</span>
              <span className="font-mono text-xs">0xB3B022fC6c73eA4683882cE0F6C3a686B1616aBa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
