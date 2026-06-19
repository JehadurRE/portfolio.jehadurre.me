// ⚡ Bolt Performance Optimization:
// Hoisted shared Intl.DateTimeFormat instance to avoid costly re-initializations across multiple components.
// Centralized formatDate utility reduces code duplication.
export const sharedDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
});

export const formatDate = (dateString: string | Date) => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return sharedDateFormatter.format(date);
};