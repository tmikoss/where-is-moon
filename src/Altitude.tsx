export const Altitude = ({ degrees }: { degrees: number }) => {
  const clampedDegrees = Math.max(degrees, -45)

  const pointerClass = clampedDegrees > 0 ? 'stroke-neutral-100' : 'stroke-neutral-400'

  return (
    <svg viewBox="0 0 100 100">
      <line
        x1={10}
        y1={50}
        x2={90}
        y2={50}
        strokeWidth="0.25"
        strokeLinecap="round"
        strokeDasharray="1"
        className="stroke-neutral-600"
      />

      <path
        d="M 50 10 A 40 40 0 0 1 90 50"
        className="stroke-neutral-600"
        strokeWidth="2"
        id="above-horizon"
      />

      <path
        d="M 90 50 A 40 40 0 0 1 78.28 78.28"
        className="stroke-neutral-600"
        strokeWidth="2"
        strokeDasharray="1"
        strokeDashoffset="1"
        id="below-horizon"
      />

      <line
        x1={50}
        y1={23}
        x2={50}
        y2={13}
        strokeWidth="2"
        strokeLinecap="round"
        className={pointerClass}
        transform={`rotate(${90 - clampedDegrees}, 50, 50)`}
      />

      <text
        x={50}
        y={50}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-neutral-200 font-bold"
        fontSize="8"
      >
        {Math.round(degrees)}°
      </text>
    </svg>
  )
}
