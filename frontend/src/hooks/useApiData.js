// src/hooks/useApiData.js
import { useState, useEffect } from 'react';

export const useApiData = (apiFunction, adapter = null, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction();
        
        // Applique l'adaptateur si fourni
        const adaptedData = adapter ? adapter(result) : result;
        setData(adaptedData);
      } catch (err) {
        setError(err.message);
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = async () => {
    await fetchData();
  };

  return { data, loading, error, refetch };
};