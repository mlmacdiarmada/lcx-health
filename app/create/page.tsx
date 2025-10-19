'use client'
import { useState, useEffect } from 'react'
import { createJob, getJob } from '../../lib/api'

export default function CreatePage() {
  const [topic, setTopic] = useState('What is HRT?')
  const [lengthSec, setLengthSec] = useState(45)
  const [jobId, setJobId] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setError(null); setVideoUrl(null); setStatus(null); setJobId(null)
    try {
      const r = await createJob({ topic, length_sec: lengthSec, provider: 'ffmpeg', block_phi: true })
      setJobId(r.id); setStatus(r.status)
    } catch (e: any) { setError(e.message || String(e)) }
  }

  useEffect(() => {
    if (!jobId) return
    const t = setInterval(async () => {
      try {
        const j = await getJob(jobId)
        setStatus(j.status)
        if (j.video_url) setVideoUrl(j.video_url)
        if (j.status === 'completed' || j.status === 'failed') clearInterval(t)
      } catch (e: any) { setError(e.message || String(e)); clearInterval(t) }
    }, 2000)
    return () => clearInterval(t)
  }, [jobId])

  return (
    <main style={{ padding: 24, maxWidth: 700, margin: '0 auto' }}>
      <h1>New Medical Explainer</h1>
      <label style={{ display: 'block', marginTop: 12 }}>
        <div>Topic</div>
        <textarea rows={4} value={topic} onChange={e => setTopic(e.target.value)} style={{ width: '100%' }} />
      </label>
      <label style={{ display: 'block', marginTop: 12 }}>
        <div>Length (sec)</div>
        <input type="number" value={lengthSec} onChange={e => setLengthSec(parseInt(e.target.value || '0'))} />
      </label>
      <div style={{ marginTop: 12 }}>
        <button onClick={submit}>Create</button>
      </div>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {jobId && <p>Job ID: <code>{jobId}</code></p>}
      {status && <p>Status: <b>{status}</b></p>}
      {videoUrl && (
        <>
          <p style={{ marginTop: 12 }}><i>Server path:</i> {videoUrl}</p>
          {videoUrl.startsWith('file://') ? (
            <p><a href={`https://YOUR-RENDER-URL.onrender.com/api/download/${jobId}`}>Download MP4</a></p>
          ) : (
            <video src={videoUrl} controls style={{ width: '100%', marginTop: 12 }} />
          )}
        </>
      )}
    </main>
  )
}