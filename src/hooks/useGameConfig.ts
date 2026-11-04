import { useState, useEffect } from 'react';
import { stackTowerService, DEFAULT_STACK_TOWER_CONFIG } from '../api';
import { StackTowerConfigData } from '../api/types';

export function useGameConfig() {
  const [config, setConfig] = useState<StackTowerConfigData>(DEFAULT_STACK_TOWER_CONFIG);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadConfig() {
      try {
        setLoading(true);
        const data = await stackTowerService.getConfig();
        if (isMounted) {
          setConfig(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch config');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  return { config, loading, error };
}

