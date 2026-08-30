/**
 * FR-020: the date-range filter's start date must not be after its end
 * date. Either bound is optional (an unset bound is not a violation).
 */
export function validateDateRange(from?: string, to?: string): boolean {
  if (!from || !to) return true;
  return new Date(from).getTime() <= new Date(to).getTime();
}
