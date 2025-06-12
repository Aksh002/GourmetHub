'use client'

import { useEffect, useState } from 'react'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Remove any client-side only attributes
    const body = document.body
    if (body.hasAttribute('cz-shortcut-listen')) {
      body.removeAttribute('cz-shortcut-listen')
    }

    // Add any necessary client-side classes
    body.classList.add('antialiased')
    
    setMounted(true)
  }, [])

  // Only render children after component has mounted on the client
  if (!mounted) {
    return null
  }

  return <>{children}</>
} 