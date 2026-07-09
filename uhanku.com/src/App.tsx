import { lazy, Suspense, useEffect, useState } from 'react'
import Landing from './Landing'

const Me = lazy(() => import('./me/Me'))

function RouteFallback() {
  return <main style={{ minHeight: '100vh' }}>Loading...</main>
}

function App() {
  const [path, setPath] = useState(() => window.location.pathname.replace(/\/+$/, '') || '/')

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname.replace(/\/+$/, '') || '/')
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const navigate = (nextPath) => {
    const normalizedPath = nextPath.replace(/\/+$/, '') || '/'

    if (normalizedPath === path) {
      return
    }

    window.history.pushState({}, '', normalizedPath)
    setPath(normalizedPath)
  }

  return (
    <Suspense fallback={<RouteFallback />}>
      {path === '/me' ? <Me /> : <Landing onNavigate={navigate} />}
    </Suspense>
  )
}

export default App
