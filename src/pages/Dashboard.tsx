
import DashboardLayout from "../components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { useCryptoData } from "../contexts/CryptoDataContext";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

const Dashboard = () => {
  const { cryptocurrencies, walletAssets } = useCryptoData();

  // Calculate total portfolio value
  const portfolioValue = walletAssets.reduce((total, asset) => {
    const cryptoPrice = cryptocurrencies.find(c => c.id === asset.id)?.current_price || 0;
    return total + (asset.amount * cryptoPrice);
  }, 0);

  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    }
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  // Top gainers and losers
  const sortedCryptos = [...cryptocurrencies].sort((a, b) => 
    b.price_change_percentage_24h - a.price_change_percentage_24h
  );
  
  const topGainers = sortedCryptos.slice(0, 3);
  const topLosers = [...sortedCryptos].sort((a, b) => 
    a.price_change_percentage_24h - b.price_change_percentage_24h
  ).slice(0, 3);

  // Create chart data for portfolio performance
  const portfolioChartData = Array.from({ length: 30 }, (_, i) => ({
    name: `Day ${i + 1}`,
    value: 15000 + Math.random() * 5000 + (i * 100)
  }));

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Overview */}
        <Card className="bg-crypto-bg-card border-gray-800 p-6 col-span-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Portfolio Overview</h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-400">Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Total Value</div>
              <div className="text-2xl font-bold text-white mt-1">{formatNumber(portfolioValue)}</div>
              <div className="text-sm text-green-400 flex items-center mt-2">
                <TrendingUp className="h-4 w-4 mr-1" />
                +3.2% (24h)
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Assets</div>
              <div className="text-2xl font-bold text-white mt-1">{walletAssets.length}</div>
              <div className="text-sm text-primary flex items-center mt-2">
                <DollarSign className="h-4 w-4 mr-1" />
                {walletAssets.map(a => a.symbol).join(", ")}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-gray-400 text-sm">24h Change</div>
              <div className="text-2xl font-bold text-green-400 mt-1">+$247.32</div>
              <div className="text-sm text-green-400 flex items-center mt-2">
                <TrendingUp className="h-4 w-4 mr-1" />
                +1.7%
              </div>
            </div>
          </div>

          <div className="mt-6 h-60">
            <h3 className="text-md font-medium text-gray-300 mb-4">Portfolio Performance</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={portfolioChartData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopColor="0.8" />
                    <stop offset="95%" stopColor="#38bdf8" stopColor="0" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tick={false} />
                <YAxis hide={true} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#fff" }}
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, "Value"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#38bdf8"
                  fillOpacity={0.2}
                  fill="url(#portfolioGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Market Trends */}
        <div className="lg:col-span-2">
          <Card className="bg-crypto-bg-card border-gray-800 p-6 h-full">
            <h2 className="text-xl font-bold text-white mb-6">Market Trends</h2>
            <div className="grid grid-cols-1 gap-4">
              {cryptocurrencies.slice(0, 5).map((crypto) => (
                <div
                  key={crypto.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center">
                    <img src={crypto.image} alt={crypto.name} className="h-8 w-8 mr-3" />
                    <div>
                      <div className="text-white font-medium">{crypto.name}</div>
                      <div className="text-gray-400 text-sm">{crypto.symbol.toUpperCase()}</div>
                    </div>
                  </div>
                  <div className="flex-1 mx-4 hidden md:block">
                    <div className="h-10">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={crypto.sparkline.map((value, index) => ({ value, index }))}>
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={crypto.price_change_percentage_24h >= 0 ? "#4ade80" : "#ef4444"}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">${crypto.current_price.toLocaleString()}</div>
                    <div
                      className={`text-sm ${
                        crypto.price_change_percentage_24h >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      } flex items-center justify-end`}
                    >
                      {crypto.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {crypto.price_change_percentage_24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Top Gainers & Losers */}
        <div>
          <Card className="bg-crypto-bg-card border-gray-800 p-6 h-full">
            <h2 className="text-xl font-bold text-white mb-4">Top Performers</h2>
            
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-300 mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1 text-green-400" />
                Top Gainers
              </h3>
              {topGainers.map((crypto) => (
                <div
                  key={`gainer-${crypto.id}`}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center">
                    <img src={crypto.image} alt={crypto.name} className="h-6 w-6 mr-2" />
                    <span className="text-white">{crypto.symbol.toUpperCase()}</span>
                  </div>
                  <div className="text-green-400">
                    +{crypto.price_change_percentage_24h.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-300 mb-3 flex items-center">
                <TrendingDown className="h-4 w-4 mr-1 text-red-400" />
                Top Losers
              </h3>
              {topLosers.map((crypto) => (
                <div
                  key={`loser-${crypto.id}`}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center">
                    <img src={crypto.image} alt={crypto.name} className="h-6 w-6 mr-2" />
                    <span className="text-white">{crypto.symbol.toUpperCase()}</span>
                  </div>
                  <div className="text-red-400">
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
