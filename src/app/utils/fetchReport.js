


export async function fetchReport(endpoint) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/reports/${endpoint}`);
  if (!res.ok) throw new Error(`Failed to fetch report: ${endpoint}`);
  return await res.json();
}
