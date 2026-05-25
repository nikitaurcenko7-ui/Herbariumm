import { useEffect, useState } from 'react'

export function useRoute() {
  const [route, setRoute] = useState(location.hash.replace('#/', '') || 'home')

  useEffect(() => {
    const onHash = () => setRoute(location.hash.replace('#/', '') || 'home')
    addEventListener('hashchange', onHash)
    return () => removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (next) => {
    location.hash = `/${next}`
    setRoute(next)
    scrollTo({ top: 0, behavior: 'smooth' })
  }

  return [route, navigate]
}
