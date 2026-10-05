export function money(n: number, currency = "USDC") {
  const value = n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${value} ${currency}`;
}

export function compact(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function postedAgo(days: number) {
  if (days <= 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 7) return `Posted ${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "Posted last week" : `Posted ${weeks} weeks ago`;
}

export function deadlineIn(days: number) {
  if (days <= 0) return "Closes today";
  if (days === 1) return "Closes tomorrow";
  return `Closes in ${days} days`;
}
