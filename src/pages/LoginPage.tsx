/* eslint-disable @typescript-eslint/no-unused-vars */
import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isLoggedIn, loginWithPassword, setClientId } from '../auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If already logged in, redirect to landing
  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/landing', { replace: true })
    }
  }, [navigate])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!username || !password) {
      setError('Please enter username and password')
      return
    }
    setLoading(true)
    try {
      const { client_id } = await loginWithPassword(username, password)
      setClientId(client_id)
      navigate('/landing', { replace: true })
    } catch (err) {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <h1 className="login__title">Iron Fit</h1>
      <p className="login__subtitle">Sign in to continue</p>
      <form className="login__form" onSubmit={onSubmit}>
        <label className="field">
          <span>Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && <div className="error" role="alert">{error}</div>}
        <button className="btn btn--primary" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
