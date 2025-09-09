/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import type { ClassItem, Participant } from '../data'
import { getClientId } from '../auth'

export default function ClassDetails() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [cls, setCls] = useState<ClassItem | null>(null)
  const [people, setPeople] = useState<Participant[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function formatTime(iso: string) {
    const d = new Date(iso)
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }

  useEffect(() => {
    if (!id) return
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const apiUrl = import.meta.env.VITE_API_URL
        if (!apiUrl) throw new Error('API URL not set in .env (VITE_API_URL)')
        const clientId = getClientId() ?? undefined
        const res = await axios.get(`${apiUrl}/v1/classes/${id}`, {
          params: clientId ? { clientId } : undefined,
        })
        const data = res.data
        if (!data?.success) throw new Error(data?.error || 'Failed to load class')
        const c = data.class
        const capacity = Number(c.capacity ?? 0)
        const reserved = Number(c.reserved_count ?? 0)
        const spotsLeft = Math.max(0, capacity - reserved)
        const mapped: ClassItem = {
          id: String(c.id),
          title: c.title,
          start: formatTime(c.start_at),
          end: formatTime(c.end_at),
          instructor: c?.instructor?.name ?? 'Coach',
          spotsLeft: Number.isFinite(spotsLeft) ? spotsLeft : undefined,
          full: capacity > 0 ? reserved >= capacity : false,
          reserved: c.user_status === 'reserved',
          description: c.description ?? undefined,
        }
        setCls(mapped)
        const participants: Participant[] = (data.participants || []).map((p: any) => ({
          id: String(p.id),
          name: p.name,
        }))
        setPeople(participants)
      } catch (e: any) {
        setError(e?.message || 'Failed to load class details')
        setCls(null)
        setPeople([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="detail">
        <button className="back" onClick={() => navigate(-1)}>← Back</button>
        <p>Loading…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="detail">
        <button className="back" onClick={() => navigate(-1)}>← Back</button>
        <p role="alert">{error}</p>
      </div>
    )
  }

  if (!cls) {
    return (
      <div className="detail">
        <button className="back" onClick={() => navigate(-1)}>← Back</button>
        <p>Class not found.</p>
      </div>
    )
  }

  const time = `${cls.start} – ${cls.end}`

  return (
    <div className="detail">
      <header className="detail__header">
        <button className="back" onClick={() => navigate(-1)}>← Back</button>
        <h1 className="detail__title">{cls.title}</h1>
        <p className="detail__meta">{time} • {cls.instructor}</p>
      </header>

      {cls.description && <p className="detail__desc">{cls.description}</p>}

      <section className="participants">
        <div className="participants__header">
          <h2>Participants</h2>
          <span className="count">{people.length}</span>
        </div>
        <ul className="people">
          {people.map((p) => (
            <li key={p.id} className="person">
              <div className="avatar" aria-hidden>
                <span>{initials(p.name)}</span>
              </div>
              <span className="name">{p.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="detail__actions">
        <button className={`btn ${cls.full ? 'btn--muted' : 'btn--primary'}`} disabled={!!cls.full}>
          {cls.full ? 'Join Waitlist' : cls.reserved ? 'Cancel Reservation' : 'Reserve Spot'}
        </button>
      </footer>
    </div>
  )
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean)
  const [a, b] = [parts[0], parts[1]]
  const first = a?.[0] ?? ''
  const second = b?.[0] ?? (a?.[1] ?? '')
  return (first + second).toUpperCase()
}
