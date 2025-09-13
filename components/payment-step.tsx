"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building, Bitcoin, Copy, CheckCircle, Wallet, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { OnboardingData } from "./onboarding-flow"

interface PaymentStepProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  canProceed: boolean
}

interface MetaMaskOrder {
  orderId: string
  toAddress: string
  amount: string
  tokenAddress?: string
  chainId: number
  expiryTime: number
}

interface NetworkConfig {
  chainId: string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls: string[]
}

const SUPPORTED_NETWORKS: Record<number, NetworkConfig> = {
  1: {
    chainId: "0x1",
    chainName: "Ethereum Mainnet",
    nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://mainnet.infura.io/v3/"],
    blockExplorerUrls: ["https://etherscan.io/"],
  },
  137: {
    chainId: "0x89",
    chainName: "Polygon Mainnet",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"],
  },
  8453: {
    chainId: "0x2105",
    chainName: "Base",
    nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://mainnet.base.org"],
    blockExplorerUrls: ["https://basescan.org/"],
  },
}

const shareOptions = {
  full: { name: "Full Share", price: 50000 },
  half: { name: "1/2 Share", price: 25000 },
  quarter: { name: "1/4 Share", price: 12500 },
  eighth: { name: "1/8 Share", price: 6250 },
}

export function PaymentStep({ data, updateData, onNext, canProceed }: PaymentStepProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [metaMaskOrder, setMetaMaskOrder] = useState<MetaMaskOrder | null>(null)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [isSendingTx, setIsSendingTx] = useState(false)
  const [txHash, setTxHash] = useState<string>("")
  const [txStatus, setTxStatus] = useState<"pending" | "confirmed" | "failed" | null>(null)

  const basePrice = data.shareLevel ? shareOptions[data.shareLevel].price : 0
  const vipPrice = data.vipPresale ? 5000 : 0
  const totalPrice = basePrice + vipPrice

  const isMetaMaskAvailable = typeof window !== "undefined" && window.ethereum

  const connectWallet = async () => {
    if (!isMetaMaskAvailable) {
      alert("Please install MetaMask to use this payment method")
      return
    }

    setIsConnecting(true)
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      const currentChainId = await window.ethereum.request({ method: "eth_chainId" })

      setWalletAddress(accounts[0])
      setChainId(Number.parseInt(currentChainId, 16))
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const switchNetwork = async (targetChainId: number) => {
    if (!isMetaMaskAvailable) return

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SUPPORTED_NETWORKS[targetChainId].chainId }],
      })
      setChainId(targetChainId)
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [SUPPORTED_NETWORKS[targetChainId]],
          })
          setChainId(targetChainId)
        } catch (addError) {
          console.error("Failed to add network:", addError)
        }
      } else {
        console.error("Failed to switch network:", error)
      }
    }
  }

  const createMetaMaskOrder = async () => {
    setIsCreatingOrder(true)
    try {
      const order: MetaMaskOrder = {
        orderId: `TS-MM-${Date.now()}`,
        toAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
        amount: (totalPrice / 2500).toFixed(6),
        chainId: chainId || 1,
        expiryTime: Date.now() + 30 * 60 * 1000,
      }

      setMetaMaskOrder(order)
    } catch (error) {
      console.error("Failed to create order:", error)
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const sendTransaction = async () => {
    if (!metaMaskOrder || !walletAddress) return

    setIsSendingTx(true)
    try {
      const txParams = {
        from: walletAddress,
        to: metaMaskOrder.toAddress,
        value: `0x${(Number.parseFloat(metaMaskOrder.amount) * Math.pow(10, 18)).toString(16)}`,
        gas: "0x5208",
      }

      const hash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [txParams],
      })

      setTxHash(hash)
      setTxStatus("pending")

      setTimeout(() => {
        setTxStatus("confirmed")
        updateData({ paymentMethod: "metamask", transactionHash: hash })
      }, 5000)
    } catch (error) {
      console.error("Transaction failed:", error)
      setTxStatus("failed")
    } finally {
      setIsSendingTx(false)
    }
  }

  useEffect(() => {
    if (!isMetaMaskAvailable) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setWalletAddress("")
        setMetaMaskOrder(null)
      } else {
        setWalletAddress(accounts[0])
      }
    }

    const handleChainChanged = (chainId: string) => {
      setChainId(Number.parseInt(chainId, 16))
      setMetaMaskOrder(null)
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      window.ethereum.removeListener("chainChanged", handleChainChanged)
    }
  }, [isMetaMaskAvailable])

  const bankDetails = {
    iban: "DE89 3704 0044 0532 0130 00",
    swift: "COBADEFFXXX",
    bank: "Commerzbank AG",
    account: "Tiny Share Properties Ltd.",
    reference: `TS-${Date.now().toString().slice(-6)}`,
  }

  const cryptoDetails = {
    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    network: "Bitcoin (BTC)",
    amount: (totalPrice / 45000).toFixed(8),
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handlePaymentMethodSelect = (method: "bank" | "crypto" | "metamask") => {
    updateData({ paymentMethod: method })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Payment</h2>
        <p className="text-muted-foreground">{"Choose your preferred payment method to complete your purchase"}</p>
      </div>

      <Card className="bg-muted/20">
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>{data.shareLevel ? shareOptions[data.shareLevel].name : "No selection"}</span>
            <span className="font-medium">€{basePrice.toLocaleString()}</span>
          </div>
          {data.vipPresale && (
            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                VIP Presale
                <Badge variant="outline" className="text-xs">
                  Exclusive
                </Badge>
              </span>
              <span className="font-medium">€{vipPrice.toLocaleString()}</span>
            </div>
          )}
          <hr className="border-border" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">€{totalPrice.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="bank" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bank" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Bank Transfer
          </TabsTrigger>
          <TabsTrigger value="crypto" className="flex items-center gap-2">
            <Bitcoin className="h-4 w-4" />
            Cryptocurrency
          </TabsTrigger>
          <TabsTrigger value="metamask" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            MetaMask
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bank" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Bank Transfer Details
              </CardTitle>
              <CardDescription>{"Transfer the exact amount to the following account"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <div className="flex items-center gap-2">
                    <Input value={bankDetails.bank} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Account Holder</Label>
                  <div className="flex items-center gap-2">
                    <Input value={bankDetails.account} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>IBAN</Label>
                  <div className="flex items-center gap-2">
                    <Input value={bankDetails.iban} readOnly />
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(bankDetails.iban, "iban")}>
                      {copiedField === "iban" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>SWIFT/BIC</Label>
                  <div className="flex items-center gap-2">
                    <Input value={bankDetails.swift} readOnly />
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(bankDetails.swift, "swift")}>
                      {copiedField === "swift" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Payment Reference</Label>
                  <div className="flex items-center gap-2">
                    <Input value={bankDetails.reference} readOnly />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(bankDetails.reference, "reference")}
                    >
                      {copiedField === "reference" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Important:</strong> Please include the payment reference in your transfer. Processing
                  typically takes 1-3 business days.
                </p>
              </div>
              <Button onClick={() => handlePaymentMethodSelect("bank")} className="w-full" size="lg">
                Confirm Bank Transfer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crypto" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bitcoin className="h-5 w-5" />
                Cryptocurrency Payment
              </CardTitle>
              <CardDescription>{"Send the exact amount to the wallet address below"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <div className="mx-auto w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Bitcoin className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">QR Code</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Network</Label>
                    <Input value={cryptoDetails.network} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Wallet Address</Label>
                    <div className="flex items-center gap-2">
                      <Input value={cryptoDetails.address} readOnly className="font-mono text-sm" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(cryptoDetails.address, "address")}
                      >
                        {copiedField === "address" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <div className="flex items-center gap-2">
                      <Input value={`${cryptoDetails.amount} BTC`} readOnly className="font-mono" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(cryptoDetails.amount, "amount")}
                      >
                        {copiedField === "amount" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Important:</strong> Send the exact amount shown above. Transactions are typically confirmed
                  within 10-60 minutes.
                </p>
              </div>

              <Button onClick={() => handlePaymentMethodSelect("crypto")} className="w-full" size="lg">
                Confirm Crypto Payment
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metamask" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                MetaMask Payment
              </CardTitle>
              <CardDescription>{"Pay instantly with your MetaMask wallet"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isMetaMaskAvailable ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    MetaMask is not installed. Please install MetaMask browser extension to use this payment method.
                  </AlertDescription>
                </Alert>
              ) : !walletAddress ? (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                    <Wallet className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Connect Your Wallet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect your MetaMask wallet to proceed with the payment
                    </p>
                    <Button onClick={connectWallet} disabled={isConnecting} size="lg">
                      {isConnecting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Wallet className="h-4 w-4 mr-2" />
                          Connect MetaMask
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">Wallet Connected</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1 font-mono">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </p>
                  </div>

                  {chainId && !SUPPORTED_NETWORKS[chainId] ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Please switch to a supported network (Ethereum, Polygon, or Base)
                      </AlertDescription>
                    </Alert>
                  ) : null}

                  <div className="space-y-2">
                    <Label>Select Network</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(SUPPORTED_NETWORKS).map(([id, network]) => (
                        <Button
                          key={id}
                          variant={chainId === Number.parseInt(id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => switchNetwork(Number.parseInt(id))}
                          className="text-xs"
                        >
                          {network.chainName.split(" ")[0]}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {chainId && SUPPORTED_NETWORKS[chainId] && !metaMaskOrder ? (
                    <Button onClick={createMetaMaskOrder} disabled={isCreatingOrder} className="w-full" size="lg">
                      {isCreatingOrder ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Order...
                        </>
                      ) : (
                        "Create Payment Order"
                      )}
                    </Button>
                  ) : null}

                  {metaMaskOrder && (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Order ID:</span>
                          <span className="font-mono">{metaMaskOrder.orderId}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Amount:</span>
                          <span className="font-mono">{metaMaskOrder.amount} ETH</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>To Address:</span>
                          <span className="font-mono text-xs">
                            {metaMaskOrder.toAddress.slice(0, 6)}...{metaMaskOrder.toAddress.slice(-4)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Expires:</span>
                          <span>{new Date(metaMaskOrder.expiryTime).toLocaleTimeString()}</span>
                        </div>
                      </div>

                      {txStatus === "pending" && (
                        <Alert>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <AlertDescription>Transaction pending... Hash: {txHash.slice(0, 10)}...</AlertDescription>
                        </Alert>
                      )}

                      {txStatus === "confirmed" && (
                        <Alert className="border-green-200 bg-green-50">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-800">
                            Payment confirmed! Transaction: {txHash.slice(0, 10)}...
                          </AlertDescription>
                        </Alert>
                      )}

                      {txStatus === "failed" && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>Transaction failed. Please try again.</AlertDescription>
                        </Alert>
                      )}

                      {!txStatus && (
                        <Button onClick={sendTransaction} disabled={isSendingTx} className="w-full" size="lg">
                          {isSendingTx ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Sending Transaction...
                            </>
                          ) : (
                            `Pay ${metaMaskOrder.amount} ETH`
                          )}
                        </Button>
                      )}

                      {txStatus === "confirmed" && (
                        <Button onClick={() => handlePaymentMethodSelect("metamask")} className="w-full" size="lg">
                          Confirm MetaMask Payment
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center pt-6">
        <Button onClick={onNext} disabled={!canProceed} size="lg" className="px-8">
          Complete Purchase
        </Button>
      </div>
    </div>
  )
}
