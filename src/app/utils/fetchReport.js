


export async function fetchReport(endpoint) {
  const res = await fetch(`http://localhost:5000/api/reports/${endpoint}`);
  if (!res.ok) throw new Error(`Failed to fetch report: ${endpoint}`);
  return await res.json();
}
