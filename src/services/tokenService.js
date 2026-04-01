import axios from 'axios';
import { FALLBACK_TOKENS, NETWORKS } from '../utils/constants';

class TokenService {
  constructor() {
    this.tokenCache = {};
    this.lastFetch = {};
    this.cacheDuration = 5 * 60 * 1000; // 5 minutes
  }

  // Fix broken CDN domains, otherwise trust the URL as-is
  fixLogoUrl(url, address) {
    if (url && url.startsWith('http')) {
      // CoinGecko moved their CDN — rewrite old domain to new one
      return url.replace('assets.coingecko.com', 'coin-images.coingecko.com');
    }
    // No URL provided — try trustwallet CDN by contract address
    if (address && address.startsWith('0x')) {
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
    }
    return '';
  }

  async getAllTokens(network) {
    const cacheKey = network;

    if (this.tokenCache[cacheKey] && Date.now() - this.lastFetch[cacheKey] < this.cacheDuration) {
      return this.tokenCache[cacheKey];
    }

    try {
      console.log('Fetching all tokens for', network);

      const tokens = await this.fetchFromMultipleSources(network);

      const nativeToken = {
        symbol: 'ETH',
        address: 'native',
        decimals: 18,
        name: 'Ethereum',
        logoURI: 'https://coin-images.coingecko.com/coins/images/279/small/ethereum.png'
      };

      this.tokenCache[cacheKey] = [nativeToken, ...tokens];
      this.lastFetch[cacheKey] = Date.now();

      console.log(`Loaded ${this.tokenCache[cacheKey].length} tokens for ${network}`);
      return this.tokenCache[cacheKey];
    } catch (error) {
      console.error('Error fetching tokens:', error);
      return FALLBACK_TOKENS[network] || FALLBACK_TOKENS.mainnet;
    }
  }

  async fetchFromMultipleSources(network) {
    const sources = [
      () => this.fetch1inchTokens(network),
      () => this.fetchUniswapTokens(network),
      () => this.fetchCoingeckoTokens(network)
    ];

    for (const source of sources) {
      try {
        const tokens = await source();
        if (tokens && tokens.length > 0) {
          return tokens;
        }
      } catch (error) {
        console.warn('Token source failed, trying next...', error.message);
        continue;
      }
    }

    return FALLBACK_TOKENS[network] || FALLBACK_TOKENS.mainnet;
  }

  async fetch1inchTokens(network) {
    const chainId = NETWORKS[network].chainIdDecimal;
    const url = `https://tokens.1inch.io/v1.2/${chainId}`;

    const response = await axios.get(url, { timeout: 10000 });

    if (response.data) {
      const tokens = Object.entries(response.data).map(([address, token]) => ({
        address: address,
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
        // 1inch returns its own CDN URLs (tokens.1inch.io) — trust them directly
        logoURI: this.fixLogoUrl(token.logoURI, address)
      }));

      return this.filterAndSortTokens(tokens);
    }

    throw new Error('No data from 1inch');
  }

  async fetchUniswapTokens(network) {
    const url = 'https://gateway.ipfs.io/ipns/tokens.uniswap.org';
    const response = await axios.get(url, { timeout: 10000 });

    if (response.data && response.data.tokens) {
      const chainId = NETWORKS[network].chainIdDecimal;
      const tokens = response.data.tokens
        .filter(token => token.chainId === chainId)
        .map(token => ({
          address: token.address,
          symbol: token.symbol,
          name: token.name,
          decimals: token.decimals,
          logoURI: this.fixLogoUrl(token.logoURI, token.address)
        }));

      return this.filterAndSortTokens(tokens);
    }

    throw new Error('No data from Uniswap');
  }

  async fetchCoingeckoTokens(network) {
    const platform = 'ethereum';
    const url = `https://api.coingecko.com/api/v3/coins/list?include_platform=true`;

    const response = await axios.get(url, { timeout: 15000 });

    if (response.data) {
      const tokens = response.data
        .filter(coin => coin.platforms && coin.platforms[platform])
        .map(coin => ({
          address: coin.platforms[platform],
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          decimals: 18,
          // CoinGecko list endpoint doesn't include images, use trustwallet CDN
          logoURI: this.fixLogoUrl(null, coin.platforms[platform])
        }));

      return this.filterAndSortTokens(tokens);
    }

    throw new Error('No data from CoinGecko');
  }

  filterAndSortTokens(tokens) {
    const unique = tokens.reduce((acc, token) => {
      const address = token.address.toLowerCase();
      if (!acc[address]) {
        acc[address] = token;
      }
      return acc;
    }, {});

    const filtered = Object.values(unique)
      .filter(token =>
        token.address &&
        token.symbol &&
        token.address.startsWith('0x') &&
        token.address.length === 42
      );

    const popularSymbols = ['USDT', 'USDC', 'DAI', 'WETH', 'WBTC', 'UNI', 'LINK', 'AAVE', 'MKR', 'SNX'];

    return filtered.sort((a, b) => {
      const aIndex = popularSymbols.indexOf(a.symbol);
      const bIndex = popularSymbols.indexOf(b.symbol);

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;

      return a.symbol.localeCompare(b.symbol);
    });
  }

  searchTokens(tokens, query) {
    if (!query) return tokens;

    const lowerQuery = query.toLowerCase();
    return tokens.filter(token =>
      token.symbol.toLowerCase().includes(lowerQuery) ||
      token.name.toLowerCase().includes(lowerQuery) ||
      token.address.toLowerCase() === lowerQuery
    );
  }
}

export default new TokenService();
