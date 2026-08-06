import { useEffect, useState } from 'react';

export type Route = {
  path: string;
  params: Record<string, string>;
  query: URLSearchParams;
};

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  const [pathPart, queryPart] = hash.split('?');
  const path = pathPart || '/';
  const query = new URLSearchParams(queryPart || '');
  return { path, params: {}, query };
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parseHash());

  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return route;
}

export function navigate(path: string) {
  window.location.hash = path;
}

export function matchRoute(pattern: string, path: string): Record<string, string> | null {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}
