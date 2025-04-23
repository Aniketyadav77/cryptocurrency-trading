
import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCryptoData } from "../contexts/CryptoDataContext";
import { ArrowUp, ArrowDown, Wallet as WalletIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const Wallet = () => {
  const { cryptocurrencies, walletAssets } = useCryptoData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("assets");

  // Calculate total portfolio value
  const portfolioValue = walletAssets.reduce((total, asset) => {
    const cryptoPrice = cryptocurrencies.find(c => c.id === asset.id)?.current_price || 0;
    return total + (asset.amount * cryptoPrice);
  }, 0);

  // Generate mock transaction history
  const mockTransactions = [
    {
      id: "t1",
      type: "buy",
      coin: "Bitcoin",
      symbol: "BTC",
      amount: 0.025,
      price: 71245.32,
      date: "2023-04-21T18:22:34",
      status: "completed"
    },
    {
      id: "t2",
      type: "sell",
      coin: "Ethereum",
      symbol: "ETH",
      amount: 0.5,
      price: 3823.45,
      date: "2023-04-19T14:12:54",
      status: "completed"
    },
    {
      id: "t3",
      type: "buy",
      coin: "Ethereum",
      symbol: "ETH",
      amount: 1.2,
      price: 3796.15,
      date: "2023-04-15T09:32:12",
      status: "completed"
    },
    {
      id: "t4",
      type: "buy",
      coin: "Bitcoin",
      symbol: "BTC",
      amount: 0.03,
      price: 69872.23,
      date: "2023-04-10T11:54:32",
      status: "completed"
    }
  ];

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Calculate asset allocation percentages
  const calculateAllocation = () => {
    return walletAssets.map(asset => {
      const cryptoPrice = cryptocurrencies.find(c => c.id === asset.id)?.current_price || 0;
      const value = asset.amount * cryptoPrice;
      const percentage = (value / portfolioValue) * 100;
      
      return {
        ...asset,
        value,
        percentage
      };
    });
  };

  const assetAllocations = calculateAllocation();

  // Helper function to get indicator class based on token symbol
  const getProgressClass = (symbol: string) => {
    if (symbol === "btc") return "bg-primary";
    if (symbol === "eth") return "bg-crypto-accent-purple";
    return "bg-crypto-accent-green";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Portfolio Summary Card */}
        <Card className="bg-crypto-bg-card border-gray-800 p-6">
          <div className="flex items-center mb-6">
            <WalletIcon className="h-6 w-6 text-primary mr-3" />
            <h2 className="text-xl font-bold text-white">Crypto Wallet</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-gray-400">Total Balance</div>
              <div className="text-3xl font-bold text-white mt-1">${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div className="mt-6 space-y-4">
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto mr-3"
                  onClick={() => navigate("/trade")}
                >
                  <ArrowUp className="mr-2 h-4 w-4" /> Buy Crypto
                </Button>
                <Button 
                  className="bg-muted hover:bg-muted/90 text-white w-full sm:w-auto"
                  onClick={() => navigate("/trade")}
                >
                  <ArrowDown className="mr-2 h-4 w-4" /> Sell Crypto
                </Button>
              </div>
            </div>

            <div className="bg-crypto-bg-dark/50 rounded-lg p-4">
              <div className="text-gray-400 mb-3">Asset Allocation</div>
              {assetAllocations.length > 0 ? (
                <div className="space-y-3">
                  {assetAllocations.map(allocation => (
                    <div key={allocation.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <div className="flex items-center">
                          <img src={allocation.image} alt={allocation.name} className="w-5 h-5 mr-2" />
                          <span className="text-white">{allocation.symbol.toUpperCase()}</span>
                        </div>
                        <div className="text-white">{allocation.percentage.toFixed(2)}%</div>
                      </div>
                      <Progress
                        value={allocation.percentage}
                        className={cn("h-2 bg-gray-800", getProgressClass(allocation.symbol))}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-sm">No assets in your wallet</div>
              )}
            </div>
          </div>
        </Card>

        {/* Assets and Transactions Tabs */}
        <Card className="bg-crypto-bg-card border-gray-800 p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-6 bg-crypto-bg-dark">
              <TabsTrigger 
                value="assets" 
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Assets
              </TabsTrigger>
              <TabsTrigger 
                value="transactions" 
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Transactions
              </TabsTrigger>
            </TabsList>
            
            {/* Assets Tab Content */}
            <TabsContent value="assets">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="py-3 px-4 text-gray-400">Asset</th>
                      <th className="py-3 px-4 text-gray-400">Balance</th>
                      <th className="py-3 px-4 text-gray-400">Price</th>
                      <th className="py-3 px-4 text-gray-400">Value</th>
                      <th className="py-3 px-4 text-gray-400">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {walletAssets.map(asset => {
                      const crypto = cryptocurrencies.find(c => c.id === asset.id);
                      const price = crypto?.current_price || 0;
                      const value = asset.amount * price;
                      
                      return (
                        <tr
                          key={asset.id}
                          className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <img
                                src={asset.image}
                                alt={asset.name}
                                className="h-8 w-8 mr-3"
                              />
                              <div>
                                <div className="font-medium text-white">
                                  {asset.name}
                                </div>
                                <div className="text-gray-400 text-sm">
                                  {asset.symbol.toUpperCase()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-medium text-white">
                            {asset.amount.toFixed(6)} {asset.symbol.toUpperCase()}
                          </td>
                          <td className="py-4 px-4 font-medium text-white">
                            ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-4 px-4 font-medium text-white">
                            ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => navigate(`/trade?coin=${asset.id}`)}
                              >
                                Trade
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {walletAssets.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-400">
                          No assets in your wallet. <Button variant="link" className="text-primary p-0 h-auto" onClick={() => navigate("/trade")}>Buy crypto</Button> to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            {/* Transactions Tab Content */}
            <TabsContent value="transactions">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="py-3 px-4 text-gray-400">Type</th>
                      <th className="py-3 px-4 text-gray-400">Asset</th>
                      <th className="py-3 px-4 text-gray-400">Amount</th>
                      <th className="py-3 px-4 text-gray-400">Price</th>
                      <th className="py-3 px-4 text-gray-400">Date</th>
                      <th className="py-3 px-4 text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTransactions.map(transaction => (
                      <tr
                        key={transaction.id}
                        className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.type === "buy" 
                              ? "bg-green-400/10 text-green-400" 
                              : "bg-red-400/10 text-red-400"
                          }`}>
                            {transaction.type === "buy" ? "Buy" : "Sell"}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="font-medium text-white">
                              {transaction.coin}
                            </div>
                            <div className="text-gray-400 text-sm ml-2">
                              {transaction.symbol}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium text-white">
                          {transaction.amount} {transaction.symbol}
                        </td>
                        <td className="py-4 px-4 font-medium text-white">
                          ${transaction.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 px-4 text-gray-300 whitespace-nowrap">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                            Completed
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Wallet;
