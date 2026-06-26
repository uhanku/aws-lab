import { useEffect, useState } from 'react'
import Landing from './Landing'
import Me from './me/Me'

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

  if (path === '/me') {
    return <Me />
  }

  return <Landing onNavigate={navigate} />
}

export default App
