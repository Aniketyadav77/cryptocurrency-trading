
import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCryptoData, CryptoCurrency } from "../contexts/CryptoDataContext";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Search, TrendingUp, TrendingDown } from "lucide-react";

const Market = () => {
  const { cryptocurrencies } = useCryptoData();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCryptos, setFilteredCryptos] = useState<CryptoCurrency[]>(cryptocurrencies);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CryptoCurrency | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "desc" });

  useEffect(() => {
    let filtered = [...cryptocurrencies];
    
    if (searchQuery) {
      filtered = filtered.filter(
        crypto => 
          crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key as keyof CryptoCurrency] < b[sortConfig.key as keyof CryptoCurrency]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key as keyof CryptoCurrency] > b[sortConfig.key as keyof CryptoCurrency]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredCryptos(filtered);
  }, [cryptocurrencies, searchQuery, sortConfig]);

  const requestSort = (key: keyof CryptoCurrency) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Format large numbers
  const formatMarketCap = (num: number): string => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    }
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    }
    return `$${(num / 1000).toFixed(2)}K`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card className="bg-crypto-bg-card border-gray-800 p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
            <h2 className="text-xl font-bold text-white">Market Overview</h2>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search cryptocurrency"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white w-full"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-3 pr-4 text-gray-400">#</th>
                  <th className="py-3 px-4 text-gray-400">Name</th>
                  <th className="py-3 px-4 text-gray-400 cursor-pointer" onClick={() => requestSort("current_price")}>
                    Price
                    {sortConfig.key === "current_price" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? " ↑" : " ↓"}
                      </span>
                    )}
                  </th>
                  <th className="py-3 px-4 text-gray-400 cursor-pointer" onClick={() => requestSort("price_change_percentage_24h")}>
                    24h %
                    {sortConfig.key === "price_change_percentage_24h" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? " ↑" : " ↓"}
                      </span>
                    )}
                  </th>
                  <th className="py-3 px-4 text-gray-400 cursor-pointer hidden md:table-cell" onClick={() => requestSort("market_cap")}>
                    Market Cap
                    {sortConfig.key === "market_cap" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? " ↑" : " ↓"}
                      </span>
                    )}
                  </th>
                  <th className="py-3 px-4 text-gray-400 hidden lg:table-cell">Last 24h</th>
                  <th className="py-3 pl-4 text-gray-400">Trade</th>
                </tr>
              </thead>
              <tbody>
                {filteredCryptos.map((crypto, index) => (
                  <tr
                    key={crypto.id}
                    className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-4 pr-4 text-gray-400">{index + 1}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <img
                          src={crypto.image}
                          alt={crypto.name}
                          className="h-8 w-8 mr-3"
                        />
                        <div>
                          <div className="font-medium text-white">
                            {crypto.name}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {crypto.symbol.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-white">
                      ${crypto.current_price.toLocaleString(undefined, { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <div
                        className={`flex items-center ${
                          crypto.price_change_percentage_24h >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {crypto.price_change_percentage_24h >= 0 ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white hidden md:table-cell">
                      {formatMarketCap(crypto.market_cap)}
                    </td>
                    <td className="py-4 px-4 hidden lg:table-cell">
                      <div className="h-10 w-32">
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
                    </td>
                    <td className="py-4 pl-4">
                      <Button 
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-white" 
                        onClick={() => window.location.href = `/trade?coin=${crypto.id}`}
                      >
                        Trade
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Market;
