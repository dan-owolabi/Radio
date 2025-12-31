export default function SpeakerGrille() {
  return (
    <div className="h-16 w-full relative overflow-hidden mt-2">
      <div className="absolute inset-0 speaker-grille"></div>
      {/* Glossy overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"></div>
    </div>
  )
}
