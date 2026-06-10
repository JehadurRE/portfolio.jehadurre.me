// Security enhancement: Sanitize URLs to prevent XSS attacks via javascript: and vbscript: URIs
// and potentially harmful data: URIs in links
export const sanitizeUrl = (url: string | undefined, isImage: boolean = false): string | undefined => {
  if (!url) return undefined;

  let decodedUrl = url;
  try {
    decodedUrl = decodeURIComponent(url);
  } catch {
    // Ignore malformed URIs
  }

  // Strip control characters and whitespaces that can bypass naive filters
  // eslint-disable-next-line no-control-regex
  const sanitized = decodedUrl.replace(/[\x00-\x20]/g, '');

  if (/^(?:javascript|vbscript):/i.test(sanitized)) {
    return '#';
  }

  // Block data: URIs for links (prevents data:text/html XSS)
  // Allow safe data:image URIs for images
  if (/^data:/i.test(sanitized)) {
    if (isImage && /^data:image\//i.test(sanitized)) {
      return url;
    }
    return '#';
  }

  return url;
};
