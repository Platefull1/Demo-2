'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@stackframe/stack';

/**
 * Visibilidade do menu CMV Real — só cmv_real.visualizar (RH),
 * independente de UserToolPermission / SystemTool.CMV.
 */
export function useCmvRealAccess() {
  const user = useUser({ or: 'return-null' });
  const [canView, setCanView] = useState(false);
  const [lojaNaoConfigurada, setLojaNaoConfigurada] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCanView(false);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/cmv-real/access?_t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) {
          if (!cancelled) setCanView(false);
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          setCanView(data.canView === true && data.lojaNaoConfigurada !== true);
          setLojaNaoConfigurada(data.lojaNaoConfigurada === true);
        }
      } catch {
        if (!cancelled) setCanView(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return { canView, lojaNaoConfigurada, loading };
}
