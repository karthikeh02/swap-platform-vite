import { useState } from 'react';
import priceService from '../services/priceService';
import { useNetwork } from '../context/NetworkContext';

export function usePrices() {
  const { currentNetwork } = useNetwork();
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch single token price
  const fetchPrice = async (token) => {
    // Return cached if available
    if (prices[token.symbol]) {
      return prices[token.symbol];
    }

    try {
      const price = await priceService.getPrice(
        token.address, 
        token.symbol, 
        currentNetwork
      );
      
      setPrices(prev => ({ 
        ...prev, 
        [token.symbol]: price 
      }));
      
      return price;
    } catch (err) {
      console.error(`Failed to fetch price for ${token.symbol}:`, err);
      return 0;
    }
  };

  // Batch fetch for multiple tokens
  const fetchMultiplePrices = async (tokens) => {
    setLoading(true);
    try {
      const priceMap = await priceService.getBatchPrices(tokens, currentNetwork);
      setPrices(prev => ({ ...prev, ...priceMap }));
      return priceMap;
    } catch (err) {
      console.error('Batch price fetch error:', err);
      return {};
    } finally {
      setLoading(false);
    }
  };

  return { 
    prices, 
    loading, 
    fetchPrice,
    fetchMultiplePrices
  };
}