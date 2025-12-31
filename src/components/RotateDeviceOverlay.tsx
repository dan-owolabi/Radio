

interface RotateDeviceOverlayProps {
  children: React.ReactNode
}

export default function RotateDeviceOverlay({ children }: RotateDeviceOverlayProps) {
  // Portrait mode is now supported with vertical stacking
  return <>{children}</>
}

