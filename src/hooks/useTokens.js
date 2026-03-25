import { useState, useEffect } from 'react';
import tokenService from '../services/tokenService';
import { useNetwork } from '../context/NetworkContext';

export function useTokens() {
  const { currentNetwork } = useNetwork();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTokens();
  }, [currentNetwork]);

  const loadTokens = async () => {
    try {
      setLoading(true);
      const allTokens = await tokenService.getAllTokens(currentNetwork);
      setTokens(allTokens);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchTokens = (query) => {
    return tokenService.searchTokens(tokens, query);
  };

  return { tokens, loading, error, searchTokens, reload: loadTokens };
}