export const NETWORKS = {
  mainnet: {
    chainId: '0x1',
    chainIdDecimal: 1,
    chainName: 'Ethereum Mainnet',
    rpcUrls: [
      'https://eth-mainnet.g.alchemy.com/v2/x0UaENSkO6jSXd6w0wBr5',
      'https://eth.llamarpc.com',
      'https://ethereum.publicnode.com'
    ],
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    color: 'from-blue-500 to-purple-600'
  }
};

// Get from environment variables (Vite style)
export const RECEIVER_ADDRESS = import.meta.env.VITE_RECEIVER_ADDRESS;
export const CONTACT_NUMBER = import.meta.env.VITE_CONTACT_NUMBER;

export const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)'
];

export const FALLBACK_TOKENS = {
  mainnet: [
    { symbol: 'ETH', address: 'native', decimals: 18, name: 'Ethereum', logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
    { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, name: 'Tether USD', logoURI: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
    { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, name: 'USD Coin', logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png' },
    { symbol: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18, name: 'Dai Stablecoin', logoURI: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png' },
    { symbol: 'WETH', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18, name: 'Wrapped Ether', logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png' },
    { symbol: 'WBTC', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8, name: 'Wrapped Bitcoin', logoURI: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png' },
    { symbol: 'UNI', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', decimals: 18, name: 'Uniswap', logoURI: 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png' },
    { symbol: 'LINK', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', decimals: 18, name: 'Chainlink', logoURI: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png' },
    { symbol: 'AAVE', address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', decimals: 18, name: 'Aave', logoURI: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png' },
    { symbol: 'MKR', address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', decimals: 18, name: 'Maker', logoURI: 'https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png' }
  ]
};