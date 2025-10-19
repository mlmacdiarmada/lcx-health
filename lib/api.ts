const BASE = process.env.NEXT_PUBLIC_API_BASE || "https://lcx-api.onrender.com";

export async function createJob(payload: any) {
  const res = await fetch(`${BASE}/api/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getJob(id: string) {
  const res = await fetch(`${BASE}/api/jobs/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
