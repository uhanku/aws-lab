import { lazy, Suspense, useEffect, useState } from 'react'
import LandingArcade from './LandingArcade'

const Me = lazy(() => import('./me/Me'))
const Blog = lazy(() => import('./blog/Blog'))

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

  const navigate = (nextPath: string) => {
    const normalizedPath = nextPath.replace(/\/+$/, '') || '/'

    if (normalizedPath === path) {
      return
    }

    window.history.pushState({}, '', normalizedPath)
    setPath(normalizedPath)
  }

  const isBlogPath = path === '/blog' || path.startsWith('/blog/')

  return (
    <Suspense fallback={<RouteFallback />}>
      {path === '/me' ? (
        <Me />
      ) : isBlogPath ? (
        <Blog path={path} onNavigate={navigate} />
      ) : (
        <LandingArcade onNavigate={navigate} />
      )}
    </Suspense>
  )
}

export default App
