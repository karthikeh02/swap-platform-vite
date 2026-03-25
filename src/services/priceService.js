import axios from 'axios';
import { ethers } from 'ethers';

class PriceService {
  constructor() {
    this.priceCache = {};
    this.lastFetch = {};
    this.cacheDuration = 30000; // 30 seconds
    this.failureCount = {};
    this.maxFailures = 3;
  }

  async getPrice(tokenAddress, symbol, network) {
    const cacheKey = `${network}-${tokenAddress.toLowerCase()}`;
    
    // Return cached price if available
    if (
      this.priceCache[cacheKey] &&
      this.lastFetch[cacheKey] &&
      Date.now() - this.lastFetch[cacheKey] < this.cacheDuration
    ) {
      return this.priceCache[cacheKey];
    }

    try {
      let price = 0;

      if (tokenAddress === 'native') {
        price = await this.getEthPrice();
      } else {
        price = await this.getTokenPrice(tokenAddress, symbol, network);
      }

      this.priceCache[cacheKey] = price;
      this.lastFetch[cacheKey] = Date.now();
      this.failureCount[cacheKey] = 0;
      
      return price;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      this.failureCount[cacheKey] = (this.failureCount[cacheKey] || 0) + 1;
      
      return this.priceCache[cacheKey] || 0;
    }
  }

  async getEthPrice() {
    const sources = [
      () => this.fetchCoinGeckoEthPrice(),
      () => this.fetchCryptoCompareEthPrice(),
      () => this.fetchBinanceEthPrice(),
      () => this.fetchCoinbaseEthPrice(),
      () => this.fetchKrakenEthPrice()
    ];

    return await this.tryMultipleSources(sources, 'ETH');
  }

  async getTokenPrice(address, symbol, network) {
    const sources = [
      () => this.fetchCoinGeckoTokenPrice(address, network),
      () => this.fetchCryptoCompareTokenPrice(symbol),
      () => this.fetch1inchPrice(address, network),
      () => this.fetchDexScreenerPrice(address, network),
      () => this.fetchUniswapV2Price(address, network)
    ];

    return await this.tryMultipleSources(sources, symbol);
  }

  async tryMultipleSources(sources, identifier) {
    for (let i = 0; i < sources.length; i++) {
      try {
        const price = await sources[i]();
        if (price > 0) {
          console.log(`✅ Price for ${identifier} from source ${i + 1}: $${price}`);
          return price;
        }
      } catch (error) {
        console.warn(`⚠️ Source ${i + 1} failed for ${identifier}:`, error.message);
        if (i === sources.length - 1) {
          console.error(`❌ All sources failed for ${identifier}`);
        }
        continue;
      }
    }
    return 0;
  }

  // ==================== ETH PRICE SOURCES ====================

  async fetchCoinGeckoEthPrice() {
    const apiKey = import.meta.env.VITE_COINGECKO_API_KEY;
    const headers = apiKey ? { 'x-cg-pro-api-key': apiKey } : {};
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      { headers, timeout: 5000 }
    );
    return response.data?.ethereum?.usd || 0;
  }

  async fetchCryptoCompareEthPrice() {
    const response = await axios.get(
      'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD',
      { timeout: 5000 }
    );
    return response.data?.USD || 0;
  }

  async fetchBinanceEthPrice() {
    const response = await axios.get(
      'https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT',
      { timeout: 5000 }
    );
    return parseFloat(response.data?.price) || 0;
  }

  async fetchCoinbaseEthPrice() {
    const response = await axios.get(
      'https://api.coinbase.com/v2/prices/ETH-USD/spot',
      { timeout: 5000 }
    );
    return parseFloat(response.data?.data?.amount) || 0;
  }

  async fetchKrakenEthPrice() {
    const response = await axios.get(
      'https://api.kraken.com/0/public/Ticker?pair=ETHUSD',
      { timeout: 5000 }
    );
    const ethData = response.data?.result?.XETHZUSD;
    return parseFloat(ethData?.c?.[0]) || 0;
  }

  // ==================== TOKEN PRICE SOURCES ====================

  async fetchCoinGeckoTokenPrice(address, network) {
    const apiKey = import.meta.env.VITE_COINGECKO_API_KEY;
    const headers = apiKey ? { 'x-cg-pro-api-key': apiKey } : {};
    const platform = 'ethereum';
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/token_price/${platform}?contract_addresses=${address}&vs_currencies=usd`,
      { headers, timeout: 5000 }
    );
    return response.data[address.toLowerCase()]?.usd || 0;
  }

  async fetchCryptoCompareTokenPrice(symbol) {
    const response = await axios.get(
      `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD`,
      { timeout: 5000 }
    );
    return response.data?.USD || 0;
  }

  async fetch1inchPrice(address, network) {
    const chainId = network === 'mainnet' ? 1 : 11155111;
    
    const response = await axios.get(
      `https://api.1inch.dev/price/v1.1/${chainId}/${address}`,
      { timeout: 5000 }
    );
    
    return parseFloat(response.data?.USD) || 0;
  }

  async fetchDexScreenerPrice(address, network) {
    const response = await axios.get(
      `https://api.dexscreener.com/latest/dex/tokens/${address}`,
      { timeout: 5000 }
    );
    
    const pairs = response.data?.pairs;
    if (pairs && pairs.length > 0) {
      const bestPair = pairs.reduce((best, current) => {
        const bestLiq = parseFloat(best.liquidity?.usd || 0);
        const currentLiq = parseFloat(current.liquidity?.usd || 0);
        return currentLiq > bestLiq ? current : best;
      }, pairs[0]);
      
      return parseFloat(bestPair.priceUsd) || 0;
    }
    
    return 0;
  }

  async fetchUniswapV2Price(address, network) {
    if (network !== 'mainnet') {
      throw new Error('Uniswap V2 price fetch only supported on mainnet');
    }

    let providerUrl;
    if (import.meta.env.VITE_ALCHEMY_KEY) {
      providerUrl = `https://eth-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_KEY}`;
    } else if (import.meta.env.VITE_INFURA_KEY) {
      providerUrl = `https://mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_KEY}`;
    } else {
      throw new Error('No RPC provider key (ALCHEMY_KEY or INFURA_KEY) provided');
    }

    const provider = new ethers.JsonRpcProvider(providerUrl);

    const FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
    const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

    const factoryAbi = ['function getPair(address tokenA, address tokenB) external view returns (address pair)'];
    const pairAbi = [
      'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
      'function token0() external view returns (address)',
      'function token1() external view returns (address)'
    ];
    const erc20Abi = ['function decimals() external view returns (uint8)'];

    try {
      const factory = new ethers.Contract(FACTORY_ADDRESS, factoryAbi, provider);
      const pairAddress = await factory.getPair(address, WETH_ADDRESS);

      if (pairAddress === ethers.ZeroAddress) {
        throw new Error('No Uniswap V2 pair found for this token');
      }

      const pair = new ethers.Contract(pairAddress, pairAbi, provider);
      const [reserve0, reserve1] = await pair.getReserves();
      const token0 = await pair.token0();

      let reserveToken, reserveWETH;
      if (token0.toLowerCase() === address.toLowerCase()) {
        reserveToken = reserve0;
        reserveWETH = reserve1;
      } else {
        reserveToken = reserve1;
        reserveWETH = reserve0;
      }

      const tokenContract = new ethers.Contract(address, erc20Abi, provider);
      const tokenDecimals = await tokenContract.decimals();

      const reserveTokenAdj = parseFloat(ethers.formatUnits(reserveToken, tokenDecimals));
      const reserveWETHAdj = parseFloat(ethers.formatEther(reserveWETH));

      if (reserveTokenAdj === 0) {
        throw new Error('No liquidity in reserves');
      }

      const priceInETH = reserveWETHAdj / reserveTokenAdj;
      const ethUsd = await this.getEthPrice();

      return priceInETH * ethUsd;
    } catch (error) {
      console.warn('Uniswap V2 fetch error:', error.message);
      throw error;
    }
  }

  // ==================== BATCH OPERATIONS ====================

  async getBatchPrices(tokens, network) {
    const promises = tokens.map(token => 
      this.getPrice(token.address, token.symbol, network)
        .catch(err => {
          console.error(`Failed to get price for ${token.symbol}:`, err);
          return 0;
        })
    );
    
    const prices = await Promise.all(promises);
    
    return tokens.reduce((acc, token, index) => {
      acc[token.symbol] = prices[index];
      return acc;
    }, {});
  }

  // ==================== UTILITIES ====================

  clearCache() {
    this.priceCache = {};
    this.lastFetch = {};
    this.failureCount = {};
  }

  getCacheStats() {
    return {
      cachedPrices: Object.keys(this.priceCache).length,
      failures: this.failureCount
    };
  }
}

export default new PriceService();