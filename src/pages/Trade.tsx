
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCryptoData, CryptoCurrency } from "../contexts/CryptoDataContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { ArrowUp, ArrowDown, Bitcoin } from "lucide-react";
import { toast } from "sonner";

const Trade = () => {
  const { cryptocurrencies, buyCrypto, sellCrypto, walletAssets } = useCryptoData();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const coinParam = params.get("coin");
  
  const [selectedCoin, setSelectedCoin] = useState<CryptoCurrency | null>(null);
  const [amount, setAmount] = useState<string>("0");
  const [total, setTotal] = useState<number>(0);
  const [timeframe, setTimeframe] = useState<string>("1D");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  
  // Find selected coin either from URL parameter or default to first cryptocurrency
  useEffect(() => {
    if (coinParam) {
      const coin = cryptocurrencies.find(c => c.id === coinParam);
      if (coin) {
        setSelectedCoin(coin);
        return;
      }
    }
    
    if (cryptocurrencies.length > 0 && !selectedCoin) {
      setSelectedCoin(cryptocurrencies[0]);
    }
  }, [coinParam, cryptocurrencies]);

  // Update total when amount or selected coin changes
  useEffect(() => {
    if (selectedCoin) {
      const numAmount = parseFloat(amount) || 0;
      setTotal(numAmount * selectedCoin.current_price);
    }
  }, [amount, selectedCoin]);

  const handleCoinChange = (value: string) => {
    const coin = cryptocurrencies.find(c => c.id === value);
    if (coin) {
      setSelectedCoin(coin);
      navigate(`/trade?coin=${value}`);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleExecuteTrade = () => {
    if (!selectedCoin) return;
    
    const amountValue = parseFloat(amount);
    
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (tradeType === "buy") {
      buyCrypto(selectedCoin, amountValue);
      setAmount("0");
    } else {
      const success = sellCrypto(selectedCoin, amountValue);
      if (success) {
        setAmount("0");
      }
    }
  };

  const userBalance = walletAssets.find(asset => selectedCoin && asset.id === selectedCoin.id);

  // Format price with appropriate decimal places
  const formatPrice = (price: number) => {
    if (price < 0.1) return price.toFixed(6);
    if (price < 1) return price.toFixed(4);
    if (price < 10) return price.toFixed(3);
    if (price < 1000) return price.toFixed(2);
    return price.toLocaleString();
  };

  // Generate mock historical data for chart
  const generateChartData = () => {
    if (!selectedCoin) return [];
    
    const basePrice = selectedCoin.current_price;
    const volatility = basePrice * 0.05; // 5% volatility
    
    let numPoints = 24;
    let interval = "1H";
    
    switch (timeframe) {
      case "1D": 
        numPoints = 24;
        interval = "1H";
        break;
      case "1W":
        numPoints = 7;
        interval = "1D";
        break;
      case "1M":
        numPoints = 30;
        interval = "1D";
        break;
      case "1Y":
        numPoints = 12;
        interval = "1M";
        break;
    }
    
    return Array.from({ length: numPoints }, (_, i) => {
      const random = Math.random() * 2 - 1; // Between -1 and 1
      const priceChange = random * volatility;
      const timestamp = new Date();
      
      switch (interval) {
        case "1H":
          timestamp.setHours(timestamp.getHours() - (numPoints - i));
          break;
        case "1D":
          timestamp.setDate(timestamp.getDate() - (numPoints - i));
          break;
        case "1M":
          timestamp.setMonth(timestamp.getMonth() - (numPoints - i));
          break;
      }
      
      return {
        time: timestamp.toLocaleString([], 
          interval === "1H" ? { hour: '2-digit', minute: '2-digit' } : { month: 'short', day: 'numeric' }
        ),
        price: basePrice + (priceChange * (i / numPoints)),
        volume: Math.floor(Math.random() * 10000)
      };
    });
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="xl:col-span-2">
          <Card className="bg-crypto-bg-card border-gray-800 p-6">
            {selectedCoin ? (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <img
                      src={selectedCoin.image}
                      alt={selectedCoin.name}
                      className="w-8 h-8 mr-3"
                    />
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center">
                        {selectedCoin.name}
                        <span className="text-gray-400 ml-2 text-sm">
                          {selectedCoin.symbol.toUpperCase()}
                        </span>
                      </h2>
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-white mr-2">
                          ${formatPrice(selectedCoin.current_price)}
                        </span>
                        <span
                          className={`flex items-center text-sm ${
                            selectedCoin.price_change_percentage_24h >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {selectedCoin.price_change_percentage_24h >= 0 ? (
                            <ArrowUp className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDown className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(selectedCoin.price_change_percentage_24h).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant={timeframe === "1D" ? "default" : "outline"}
                      onClick={() => setTimeframe("1D")}
                      className={timeframe === "1D" ? "bg-primary" : ""}
                    >
                      1D
                    </Button>
                    <Button
                      size="sm"
                      variant={timeframe === "1W" ? "default" : "outline"}
                      onClick={() => setTimeframe("1W")}
                      className={timeframe === "1W" ? "bg-primary" : ""}
                    >
                      1W
                    </Button>
                    <Button
                      size="sm"
                      variant={timeframe === "1M" ? "default" : "outline"}
                      onClick={() => setTimeframe("1M")}
                      className={timeframe === "1M" ? "bg-primary" : ""}
                    >
                      1M
                    </Button>
                    <Button
                      size="sm"
                      variant={timeframe === "1Y" ? "default" : "outline"}
                      onClick={() => setTimeframe("1Y")}
                      className={timeframe === "1Y" ? "bg-primary" : ""}
                    >
                      1Y
                    </Button>
                  </div>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={generateChartData()}
                      margin={{ top: 10, right: 20, left: 20, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor={selectedCoin.price_change_percentage_24h >= 0 ? "#4ade80" : "#ef4444"}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor={selectedCoin.price_change_percentage_24h >= 0 ? "#4ade80" : "#ef4444"}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="time"
                        tick={{ fill: "#9CA3AF" }}
                        axisLine={{ stroke: "#4B5563" }}
                      />
                      <YAxis
                        domain={["auto", "auto"]}
                        tick={{ fill: "#9CA3AF" }}
                        axisLine={{ stroke: "#4B5563" }}
                        tickFormatter={(value) => `$${formatPrice(value)}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          borderColor: "#4B5563",
                          color: "#fff",
                        }}
                        formatter={(value) => [`$${formatPrice(Number(value))}`, "Price"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={selectedCoin.price_change_percentage_24h >= 0 ? "#4ade80" : "#ef4444"}
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center h-80">
                <div className="text-gray-400">Loading chart data...</div>
              </div>
            )}
          </Card>
        </div>

        {/* Trading Panel */}
        <div>
          <Card className="bg-crypto-bg-card border-gray-800 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Trade</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Select Coin</label>
                <Select
                  value={selectedCoin?.id || ""}
                  onValueChange={handleCoinChange}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select a cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent className="bg-crypto-bg-card border-gray-700 text-white">
                    {cryptocurrencies.map((crypto) => (
                      <SelectItem key={crypto.id} value={crypto.id}>
                        <div className="flex items-center">
                          <img
                            src={crypto.image}
                            alt={crypto.name}
                            className="w-5 h-5 mr-2"
                          />
                          {crypto.name} ({crypto.symbol.toUpperCase()})
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Tabs
                value={tradeType}
                onValueChange={(value) => setTradeType(value as "buy" | "sell")}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="buy" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                    Buy
                  </TabsTrigger>
                  <TabsTrigger value="sell" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                    Sell
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="buy" className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Amount</label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        className="bg-gray-800 border-gray-700 text-white pr-20"
                        placeholder="0.00"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                        {selectedCoin?.symbol.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-800 pt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Total</span>
                      <span className="text-white font-medium">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    
                    <Button
                      onClick={handleExecuteTrade}
                      className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
                    >
                      Buy {selectedCoin?.symbol.toUpperCase()}
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="sell" className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-gray-400 text-sm">Amount</label>
                      {userBalance && (
                        <span className="text-xs text-gray-400">
                          Available: {userBalance?.amount.toFixed(6)} {userBalance?.symbol.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        className="bg-gray-800 border-gray-700 text-white pr-20"
                        placeholder="0.00"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                        {selectedCoin?.symbol.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-800 pt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Total</span>
                      <span className="text-white font-medium">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    
                    <Button
                      onClick={handleExecuteTrade}
                      className="w-full bg-red-600 hover:bg-red-700 text-white mt-4"
                      disabled={!userBalance || parseFloat(amount) > userBalance.amount}
                    >
                      Sell {selectedCoin?.symbol.toUpperCase()}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
          
          {/* Order Book Preview (simplified for the demo) */}
          <Card className="bg-crypto-bg-card border-gray-800 p-6 mt-6">
            <h3 className="text-lg font-bold text-white mb-4">Order Book</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-red-400 text-sm mb-2">Sell Orders</h4>
                <div className="space-y-1">
                  {[...Array(5)].map((_, i) => {
                    const price = selectedCoin ? selectedCoin.current_price * (1 + ((i + 1) * 0.002)) : 0;
                    const amount = Math.random() * 2;
                    return (
                      <div key={`sell-${i}`} className="flex justify-between text-xs">
                        <span className="text-red-400">${formatPrice(price)}</span>
                        <span className="text-gray-400">{amount.toFixed(4)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h4 className="text-green-400 text-sm mb-2">Buy Orders</h4>
                <div className="space-y-1">
                  {[...Array(5)].map((_, i) => {
                    const price = selectedCoin ? selectedCoin.current_price * (1 - ((i + 1) * 0.002)) : 0;
                    const amount = Math.random() * 2;
                    return (
                      <div key={`buy-${i}`} className="flex justify-between text-xs">
                        <span className="text-green-400">${formatPrice(price)}</span>
                        <span className="text-gray-400">{amount.toFixed(4)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Trade;
