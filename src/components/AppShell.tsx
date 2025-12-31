import { useEffect, useState } from 'react'

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const calculateScale = () => {
      const isMobile = window.innerWidth <= 768
      const isLandscape = window.innerWidth > window.innerHeight

      if (!isMobile || !isLandscape) {
        setScale(1)
        return
      }

      const designWidth = 1200
      const designHeight = 420
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight

      const scaleX = screenWidth / designWidth
      const scaleY = screenHeight / designHeight

      setScale(Math.min(scaleX, scaleY, 1)) // Don't scale up beyond 1
    }

    calculateScale()
    window.addEventListener('resize', calculateScale)
    window.addEventListener('orientationchange', calculateScale)

    return () => {
      window.removeEventListener('resize', calculateScale)
      window.removeEventListener('orientationchange', calculateScale)
    }
  }, [])

  return (
    <div
      className="bg-black w-full h-full max-md:h-screen max-md:max-h-screen flex items-center max-md:items-stretch justify-center p-0 max-md:p-2 font-geist max-md:overflow-hidden"
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'center center',
      }}
    >
      <div
        className="flex flex-row max-md:flex-col gap-[3px] max-md:w-full max-md:h-full max-md:max-h-full"
        style={{
          width: '1300px',
          maxWidth: '98vw',
          maxHeight: '98vh',
        }}
      >
        {children}
      </div>
    </div>
  )
}

