
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

export interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
  sparkline: number[];
  lastUpdated?: Date;
}

export interface WalletAsset {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  image: string;
}

interface CryptoDataContextType {
  cryptocurrencies: CryptoCurrency[];
  isLoading: boolean;
  walletAssets: WalletAsset[];
  buyCrypto: (crypto: CryptoCurrency, amount: number) => void;
  sellCrypto: (crypto: CryptoCurrency, amount: number) => boolean;
}

const mockCryptoData: CryptoCurrency[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    current_price: 72563,
    price_change_percentage_24h: 1.25,
    market_cap: 1432621456789,
    total_volume: 25367891245,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    sparkline: Array.from({ length: 48 }, () => Math.random() * 2000 + 70000),
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    current_price: 3842,
    price_change_percentage_24h: -0.67,
    market_cap: 462578934567,
    total_volume: 12986753421,
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    sparkline: Array.from({ length: 48 }, () => Math.random() * 100 + 3800),
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    current_price: 175.32,
    price_change_percentage_24h: 2.89,
    market_cap: 78945612378,
    total_volume: 3576981234,
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    sparkline: Array.from({ length: 48 }, () => Math.random() * 10 + 170),
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    current_price: 0.59,
    price_change_percentage_24h: -1.42,
    market_cap: 21543897654,
    total_volume: 789456123,
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    sparkline: Array.from({ length: 48 }, () => Math.random() * 0.05 + 0.55),
  },
  {
    id: "binancecoin",
    name: "BNB",
    symbol: "BNB",
    current_price: 641.27,
    price_change_percentage_24h: 0.34,
    market_cap: 98762345678,
    total_volume: 2345678912,
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    sparkline: Array.from({ length: 48 }, () => Math.random() * 20 + 630),
  },
  {
    id: "ripple",
    name: "Ripple",
    symbol: "XRP",
    current_price: 0.48,
    price_change_percentage_24h: 5.67,
    market_cap: 31245678901,
    total_volume: 1345678901,
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    sparkline: Array.from({ length: 48 }, () => Math.random() * 0.04 + 0.46),
  },
  {
    id: "polkadot",
    name: "Polkadot",
    symbol: "DOT",
    current_price: 7.82,
    price_change_percentage_24h: -0.93,
    market_cap: 12345678901,
    total_volume: 567890123,
    image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    sparkline: Array.from({ length: 48 }, () => Math.random() * 0.5 + 7.6),
  },
  {
    id: "dogecoin",
    name: "Dogecoin",
    symbol: "DOGE",
    current_price: 0.14,
    price_change_percentage_24h: 1.78,
    market_cap: 23456789012,
    total_volume: 890123456,
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    sparkline: Array.from({ length: 48 }, () => Math.random() * 0.01 + 0.13),
  },
];

const initialWalletAssets: WalletAsset[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    amount: 0.05,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    amount: 1.2,
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  },
];

const CryptoDataContext = createContext<CryptoDataContextType | undefined>(undefined);

export const useCryptoData = () => {
  const context = useContext(CryptoDataContext);
  if (context === undefined) {
    throw new Error("useCryptoData must be used within a CryptoDataProvider");
  }
  return context;
};

export const CryptoDataProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [cryptocurrencies, setCryptocurrencies] = useState<CryptoCurrency[]>(mockCryptoData);
  const [isLoading, setIsLoading] = useState(false);
  const [walletAssets, setWalletAssets] = useState<WalletAsset[]>(
    JSON.parse(localStorage.getItem("cryptoWallet") || JSON.stringify(initialWalletAssets))
  );

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setCryptocurrencies(prevCryptos => 
        prevCryptos.map(crypto => ({
          ...crypto,
          current_price: Math.max(0.01, crypto.current_price * (1 + (Math.random() - 0.5) * 0.01)),
          price_change_percentage_24h: crypto.price_change_percentage_24h + (Math.random() - 0.5) * 0.5,
          lastUpdated: new Date()
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem("cryptoWallet", JSON.stringify(walletAssets));
  }, [walletAssets]);

  const buyCrypto = (crypto: CryptoCurrency, amount: number) => {
    setWalletAssets(prev => {
      const existingAsset = prev.find(asset => asset.id === crypto.id);
      
      if (existingAsset) {
        return prev.map(asset => 
          asset.id === crypto.id 
            ? { ...asset, amount: asset.amount + amount } 
            : asset
        );
      } else {
        return [...prev, {
          id: crypto.id,
          symbol: crypto.symbol,
          name: crypto.name,
          amount,
          image: crypto.image
        }];
      }
    });
    
    toast.success(`Successfully purchased ${amount} ${crypto.symbol}`);
  };

  const sellCrypto = (crypto: CryptoCurrency, amount: number) => {
    const existingAsset = walletAssets.find(asset => asset.id === crypto.id);
    
    if (!existingAsset || existingAsset.amount < amount) {
      toast.error(`Insufficient ${crypto.symbol} balance`);
      return false;
    }
    
    setWalletAssets(prev => {
      const updatedAssets = prev.map(asset => 
        asset.id === crypto.id 
          ? { ...asset, amount: asset.amount - amount } 
          : asset
      ).filter(asset => asset.amount > 0);
      
      return updatedAssets;
    });
    
    toast.success(`Successfully sold ${amount} ${crypto.symbol}`);
    return true;
  };

  return (
    <CryptoDataContext.Provider
      value={{
        cryptocurrencies,
        isLoading,
        walletAssets,
        buyCrypto,
        sellCrypto
      }}
    >
      {children}
    </CryptoDataContext.Provider>
  );
};
