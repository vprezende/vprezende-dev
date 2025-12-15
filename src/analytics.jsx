import { useEffect, useState } from 'react'
import * as VercelAnalytics from '@vercel/analytics/react' // ou apenas '@vercel/analytics'

export default function AnalyticsLoader() {
  const [AnalyticsComponent, setAnalyticsComponent] = useState(null)

  useEffect(() => {
    let mounted = true

    if (mounted) {
      const Comp = VercelAnalytics?.Analytics || VercelAnalytics?.default
      if (Comp) setAnalyticsComponent(() => Comp)
    }

    return () => { mounted = false }
  }, [])

  if (!AnalyticsComponent) return null
  return <AnalyticsComponent />
}