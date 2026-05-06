import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE = '/api/v1/users'

const emptyRegister = {
  email: '',
  username: '',
  password: '',
  role: 'ADMIN',
}

const emptyLogin = {
  username: '',
  password: '',
}

function getErrorMessage(payload, fallback) {
  if (payload?.message) return payload.message
  if (payload?.error) return payload.error
  if (Array.isArray(payload?.errors) && payload.errors.length > 0) {
    return payload.errors.map((error) => error.message || error).join(', ')
  }
  return fallback
}

async function apiRequest(path, options = {}) {
  let response

  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })
  } catch {
    throw new Error(
      'Could not reach the auth API. Make sure the Vite dev server is running so the local API proxy is available.',
    )
  }

  const contentType = response.headers.get('content-type')
  const payload = contentType?.includes('application/json')
    ? await response.json()
    : null

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'Request failed. Please try again.'))
  }

  return payload
}

async function getCurrentUser() {
  return apiRequest('/current-user')
}

function App() {
  const [activeTab, setActiveTab] = useState('login')
  const [registerForm, setRegisterForm] = useState(emptyRegister)
  const [loginForm, setLoginForm] = useState(emptyLogin)
  const [currentUser, setCurrentUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState('')

  const displayUser = useMemo(() => {
    const user = currentUser?.data?.user || currentUser?.data || currentUser
    return user && typeof user === 'object' ? user : null
  }, [currentUser])

  async function fetchCurrentUser(showSuccess = false) {
    setLoading('profile')
    setMessage(null)

    try {
      const payload = await getCurrentUser()
      setCurrentUser(payload)
      if (showSuccess) {
        setMessage({ type: 'success', text: 'Current user loaded successfully.' })
      }
    } catch (error) {
      setCurrentUser(null)
      if (showSuccess) {
        setMessage({ type: 'error', text: error.message })
      }
    } finally {
      setLoading('')
    }
  }

  useEffect(() => {
    let isMounted = true

    getCurrentUser()
      .then((payload) => {
        if (isMounted) {
          setCurrentUser(payload)
        }
      })
      .catch(() => {
        if (isMounted) {
          setCurrentUser(null)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  async function handleRegister(event) {
    event.preventDefault()
    setLoading('register')
    setMessage(null)

    try {
      await apiRequest('/register', {
        method: 'POST',
        body: JSON.stringify(registerForm),
      })

      setMessage({
        type: 'success',
        text: 'Account created. Sign in with the username and password now.',
      })
      setLoginForm({
        username: registerForm.username,
        password: registerForm.password,
      })
      setRegisterForm(emptyRegister)
      setActiveTab('login')
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading('')
    }
  }

  async function handleLogin(event) {
    event.preventDefault()
    setLoading('login')
    setMessage(null)

    try {
      const payload = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify(loginForm),
      })

      setCurrentUser(payload)
      setMessage({ type: 'success', text: 'Logged in successfully.' })
      await fetchCurrentUser()
    } catch (error) {
      setCurrentUser(null)
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading('')
    }
  }

  async function handleLogout() {
    setLoading('logout')
    setMessage(null)

    try {
      await apiRequest('/logout', { method: 'POST' })
      setCurrentUser(null)
      setMessage({ type: 'success', text: 'Logged out. Session cleared.' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading('')
    }
  }

  return (
    <main className="app-shell">
      {displayUser ? (
        <DashboardPage
          currentUser={displayUser}
          loading={loading}
          message={message}
          onLogout={handleLogout}
          onRefresh={() => fetchCurrentUser(true)}
        />
      ) : (
        <AuthPage
          activeTab={activeTab}
          loading={loading}
          loginForm={loginForm}
          message={message}
          onLogin={handleLogin}
          onRegister={handleRegister}
          registerForm={registerForm}
          setActiveTab={setActiveTab}
          setLoginForm={setLoginForm}
          setRegisterForm={setRegisterForm}
        />
      )}
    </main>
  )
}

function AuthPage({
  activeTab,
  loading,
  loginForm,
  message,
  onLogin,
  onRegister,
  registerForm,
  setActiveTab,
  setLoginForm,
  setRegisterForm,
}) {
  const isLogin = activeTab === 'login'

  return (
    <section className="auth-page">
      <div className="brand-panel">
        <p className="eyebrow">FreeAPI Authentication</p>
        <h1>{isLogin ? 'Welcome back' : 'Create your account'}</h1>
        <p className="intro-copy">
          {isLogin
            ? 'Sign in to open your private profile page and manage the active session.'
            : 'Register a new FreeAPI user account, then continue to the login page.'}
        </p>
      </div>

      <section className="auth-card" aria-label={isLogin ? 'Login form' : 'Register form'}>
        <div className="auth-heading">
          <p className="eyebrow">{isLogin ? 'Login Page' : 'Register Page'}</p>
          <h2>{isLogin ? 'Sign in' : 'Register'}</h2>
        </div>

        {message && (
          <div className={`message ${message.type}`} role="status">
            {message.text}
          </div>
        )}

        {isLogin ? (
          <form className="auth-form" onSubmit={onLogin}>
            <label>
              Username
              <input
                autoComplete="username"
                onChange={(event) =>
                  setLoginForm({ ...loginForm, username: event.target.value })
                }
                placeholder="doejohn"
                required
                value={loginForm.username}
              />
            </label>
            <label>
              Password
              <input
                autoComplete="current-password"
                onChange={(event) =>
                  setLoginForm({ ...loginForm, password: event.target.value })
                }
                placeholder="test@123"
                required
                type="password"
                value={loginForm.password}
              />
            </label>
            <button className="primary-action" disabled={loading === 'login'}>
              {loading === 'login' ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={onRegister}>
            <label>
              Email
              <input
                autoComplete="email"
                onChange={(event) =>
                  setRegisterForm({ ...registerForm, email: event.target.value })
                }
                placeholder="user.email@domain.com"
                required
                type="email"
                value={registerForm.email}
              />
            </label>
            <label>
              Username
              <input
                autoComplete="username"
                onChange={(event) =>
                  setRegisterForm({
                    ...registerForm,
                    username: event.target.value,
                  })
                }
                placeholder="doejohn"
                required
                value={registerForm.username}
              />
            </label>
            <label>
              Password
              <input
                autoComplete="new-password"
                onChange={(event) =>
                  setRegisterForm({
                    ...registerForm,
                    password: event.target.value,
                  })
                }
                placeholder="test@123"
                required
                type="password"
                value={registerForm.password}
              />
            </label>
            <label>
              Role
              <select
                onChange={(event) =>
                  setRegisterForm({ ...registerForm, role: event.target.value })
                }
                value={registerForm.role}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="USER">USER</option>
              </select>
            </label>
            <button className="primary-action" disabled={loading === 'register'}>
              {loading === 'register' ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        )}

        <p className="switch-copy">
          {isLogin ? 'Need a new account?' : 'Already have an account?'}
          <button
            className="text-action"
            onClick={() => setActiveTab(isLogin ? 'register' : 'login')}
            type="button"
          >
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </p>
      </section>
    </section>
  )
}

function DashboardPage({ currentUser, loading, message, onLogout, onRefresh }) {
  return (
    <section className="dashboard-page" aria-label="Current user profile">
      <nav className="dashboard-nav">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>Profile</h2>
        </div>
        <button
          className="danger-action compact"
          disabled={loading === 'logout'}
          onClick={onLogout}
          type="button"
        >
          {loading === 'logout' ? 'Logging out...' : 'Logout'}
        </button>
      </nav>

      {message && (
        <div className={`message ${message.type}`} role="status">
          {message.text}
        </div>
      )}

      <div className="profile-hero">
        <div className="avatar" aria-hidden="true">
          {(currentUser.username || currentUser.email || 'U').slice(0, 1).toUpperCase()}
        </div>
        <div>
          <p className="eyebrow">Logged In User</p>
          <h1>{currentUser.username || 'Signed in user'}</h1>
          <p className="intro-copy">
            Your session is active. This page is shown only after login.
          </p>
        </div>
      </div>

      <div className="profile-grid">
        <ProfileItem label="Username" value={currentUser.username} />
        <ProfileItem label="Email" value={currentUser.email} />
        <ProfileItem label="Role" value={currentUser.role} />
        <ProfileItem label="User ID" value={currentUser._id || currentUser.id} />
      </div>

      <button
        className="secondary-action refresh-action"
        disabled={loading === 'profile'}
        onClick={onRefresh}
        type="button"
      >
        {loading === 'profile' ? 'Refreshing...' : 'Refresh profile'}
      </button>
    </section>
  )
}

function ProfileItem({ label, value }) {
  return (
    <div className="profile-item">
      <span>{label}</span>
      <strong>{value || 'Not available'}</strong>
    </div>
  )
}

export default App
