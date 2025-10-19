'use client'
import { useState } from 'react'
import { createJob } from '@/lib/api'

export default function CreateJobPage() {
  const [topic, setTopic] = useState('What is HRT?')
  const [lengthSec, setLengthSec] = useState(45)
  const [jobId, setJobId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setError(null)
    try {
      const r = await createJob({ topic, length_sec: lengthSec, provider: 'ffmpeg', block_phi: true })
      setJobId(r.id)
    } catch (e: any) { setError(e.message) }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">New Medical Explainer</h1>
      <label className="block">
        <span className="text-sm">Topic</span>
        <textarea value={topic} onChange={(e)=>setTopic(e.target.value)} className="w-full border rounded p-2" rows={4}/>
      </label>
      <label className="block">
        <span className="text-sm">Length (sec)</span>
        <input type="number" value={lengthSec} onChange={(e)=>setLengthSec(parseInt(e.target.value || '0'))} className="w-full border rounded p-2"/>
      </label>
      <button onClick={submit} className="bg-black text-white px-4 py-2 rounded">Create</button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {jobId && <p className="text-sm">Job created: <code>{jobId}</code>. Copy it—you’ll download in the next step.</p>}
    </div>
  )
}
