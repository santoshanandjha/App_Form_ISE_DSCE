const PUBLIC_FALLBACK_URL = "https://venue-verification-shed-simultaneously.trycloudflare.com/app";

export const getBackendApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  // Check if running on a production frontend domain (e.g., Netlify)
  const isProductionDomain = typeof window !== 'undefined' && 
    window.location.hostname !== 'localhost' && 
    window.location.hostname !== '127.0.0.1';

  if (isProductionDomain) {
    // Override local or dead tunnel URLs with active Cloudflare Tunnel URL
    if (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1') || envUrl.includes('loca.lt')) {
      return PUBLIC_FALLBACK_URL;
    }
  }

  return envUrl || PUBLIC_FALLBACK_URL;
};
