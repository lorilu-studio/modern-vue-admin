export function isInDateRange(value: string, range: string[]) {
  const [start, end] = range;
  if (!start || !end) return true;

  const date = value.slice(0, 10);
  return date >= start && date <= end;
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
