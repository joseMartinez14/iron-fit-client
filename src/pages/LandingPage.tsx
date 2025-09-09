/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import type { ClassItem } from '../data'
import type { Day } from '../data'
import { getClientId } from '../auth'

// Helper to get Monday to Friday of current week
function getCurrentWeekDays() {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 (Sun) - 6 (Sat)
  // Calculate Monday
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7))
  const daysArr = []
  const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri']
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const key = dayKeys[i]
    const label = `${dayLabels[i].slice(0, 3)}\n${d.getDate()} ${monthNames[d.getMonth()].slice(0, 3)}`
    const dateLabel = `${dayLabels[i]}, ${monthNames[d.getMonth()]} ${d.getDate()}`
    daysArr.push({ key, label, dateLabel })
  }
  return daysArr
}

const days = getCurrentWeekDays()

function getDefaultActiveDay(): Day {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 (Sun) - 6 (Sat)
  // Map to Monday=0 .. Sunday=6
  const idxFromMonday = (dayOfWeek + 6) % 7
  const index = idxFromMonday >= 0 && idxFromMonday <= 4 ? idxFromMonday : 0
  return days[index]
}

function Badge({ item }: { item: ClassItem }) {
  if (item.full) return <span className="badge badge--muted">Full</span>
  if (typeof item.spotsLeft === 'number') {
    const label = `${item.spotsLeft} spot${item.spotsLeft === 1 ? '' : 's'} left`
    return <span className="badge">{label}</span>
  }
  return null
}

function ClassCard({ item }: { item: ClassItem }) {
  const navigate = useNavigate()
  const time = `${item.start} - ${item.end}`
  const actionLabel = item.full ? 'Join Waitlist' : 'Reserve'
  return (
    <article
      className={`card ${item.reserved ? 'card--reserved' : ''}`}
      onClick={() => navigate(`/class/${item.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          navigate(`/class/${item.id}`)
        }
      }}
    >
      <div className="card__header">
        <span className="time">{time}</span>
        <Badge item={item} />
      </div>
      <h3 className="title">{item.title}</h3>
      <div className="coach">
        <div className="avatar" aria-hidden>
          <span>🏋️</span>
        </div>
        <span className="coach__name">{item.instructor}</span>
      </div>
      <button className={`btn ${item.full ? 'btn--muted' : 'btn--primary'}`} disabled={!!item.full}>
        {actionLabel}
      </button>
    </article>
  )
}

export default function LandingPage() {
  const [activeDay, setActiveDay] = useState<Day>(getDefaultActiveDay())
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function getDateRangeForKey(key: string) {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const monday = new Date(today)
    monday.setHours(0, 0, 0, 0)
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7))
    const keyIndex: Record<string, number> = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4 }
    const offset = keyIndex[key] ?? 0
    const dayStart = new Date(monday)
    dayStart.setDate(monday.getDate() + offset)
    const nextDayStart = new Date(dayStart)
    nextDayStart.setDate(dayStart.getDate() + 1)
    return { from: dayStart.toISOString(), to: nextDayStart.toISOString() }
  }

  function formatTime(iso: string) {
    const d = new Date(iso)
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const { from, to } = getDateRangeForKey(activeDay.key)
        const clientId = getClientId() ?? undefined
        const apiUrl = import.meta.env.VITE_API_URL
        if (!apiUrl) throw new Error('API URL not set in .env (VITE_API_URL)')

        const params: Record<string, string> = { from, to }
        if (clientId) params.clientId = clientId

        const res = await axios.get(`${apiUrl}/v1/classes`, { params })
        const data = res.data
        if (!data?.success) {
          throw new Error(data?.error || 'Unknown error')
        }
        const items: ClassItem[] = (data.classes || []).map((c: any) => {
          const capacity = Number(c.capacity ?? 0)
          const reserved = Number(c.reserved_count ?? 0)
          const spotsLeft = Math.max(0, capacity - reserved)
          return {
            id: String(c.id),
            title: c.title,
            start: formatTime(c.start_at),
            end: formatTime(c.end_at),
            instructor: c?.instructor?.name ?? 'Coach',
            spotsLeft: Number.isFinite(spotsLeft) ? spotsLeft : undefined,
            full: capacity > 0 ? reserved >= capacity : false,
            reserved: c.user_status === 'reserved',
            description: undefined,
          } as ClassItem
        })
        setClasses(items)
      } catch (e: any) {
        setError(e?.message || 'Failed to load classes')
        setClasses([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [activeDay])

  return (
    <div className="page">
      <header className="header">
        <h1 className="greeting">Iron Fit</h1>
        <p className="subtitle">Ready for your workout today?</p>
        <div className="week" role="tablist" aria-label="Pick a day">
          {days.map((d) => (
            <button
              key={d.key}
              role="tab"
              aria-selected={d.key === activeDay.key}
              className={`day-pill ${d.key === activeDay.key ? 'is-active' : ''}`}
              onClick={() => setActiveDay(d)}
            >
              {d.label.split('\n').map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </button>
          ))}
        </div>
      </header>

      <main className="content" aria-live="polite">
        <h2 className="day-heading">{activeDay.dateLabel}</h2>
        {loading && <p>Loading classes…</p>}
        {error && !loading && <p role="alert">{error}</p>}
        {!loading && !error && (
          <section className="list">
            {classes.map((c) => (
              <ClassCard key={c.id} item={c} />
            ))}
            {classes.length === 0 && (
              <p>No classes scheduled for this day.</p>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
