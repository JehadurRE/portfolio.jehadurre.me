export const trackEvent = (eventName: string, eventData?: Record<string, unknown>) => {
  // Try to fire plausible event if plausible is installed
  if (typeof window !== 'undefined' && 'plausible' in window) {
    (window as unknown as { plausible: (name: string, opts: { props: Record<string, unknown> | undefined }) => void }).plausible(eventName, { props: eventData });
  }
  // Try to fire umami event if umami is installed
  else if (typeof window !== 'undefined' && 'umami' in window) {
    (window as unknown as { umami: { track: (name: string, data?: Record<string, unknown>) => void } }).umami.track(eventName, eventData);
  }

  // Always log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Analytics] ${eventName}`, eventData || '');
  }
};
