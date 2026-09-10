// Helper to convert relative server file paths (/uploads/...) to full Backend URLs
export const getFullMediaUrl = (fileUrl) => {
  if (!fileUrl || typeof fileUrl !== 'string') return fileUrl;
  
  // If already full http/https URL or data: URL, return as is
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://') || fileUrl.startsWith('data:')) {
    return fileUrl;
  }
  
  // If it's a relative backend uploads path, prepend backend origin
  if (fileUrl.startsWith('/uploads/') || fileUrl.startsWith('uploads/')) {
    const cleanPath = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:9000/app';
    const backendOrigin = apiBase.replace(/\/app\/?$/, '');
    return `${backendOrigin}${cleanPath}`;
  }
  
  return fileUrl;
};
