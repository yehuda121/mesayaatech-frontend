


export async function fetchReport(endpoint) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/api/reports/${endpoint}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` }
  });

  if (!res.ok) throw new Error(`Failed to fetch report: ${endpoint}`);
  return await res.json();
}
