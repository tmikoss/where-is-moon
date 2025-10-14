export const Compass = ({ degreesUp = 0, degreesPointer }: { degreesUp?: number; degreesPointer?: number }) => {
  const scale = 100 / 162.56591

  const centerX = 50
  const centerY = 50

  return (
    <svg
      viewBox="0 0 100 100"
      className=""
    >
      <defs>
        <g id="rosette">
          <path
            d="m 64.44833,81.197 h 50.641 l -9.1546,9.1546 7.9904,35.851 c 0,0.39688 -0.37041,0.39688 -0.37041,0 l -10.663,-33.549 z m 12.2,6.48 c 2.6458,16.034 15.214,28.998 31.591,32.041 l -1.1642,-3.0427 c -13.679,-3.0692 -24.739,-14.129 -27.781,-28.231 z"
            className="fill-neutral-200 opacity-15"
          />
        </g>
      </defs>

      <g transform={`scale(${scale}) translate(-33.865799, 0)`}>
        <g transform={`rotate(${-degreesUp}, ${115.14885}, ${81.277})`}>
          <use
            href="#rosette"
            transform="rotate(-90,115.14885,81.277)"
          />
          <use
            href="#rosette"
            transform="rotate(90,115.14885,81.277)"
          />
          <use
            href="#rosette"
            transform="rotate(180,115.14885,81.277)"
          />
          <use href="#rosette" />
        </g>
      </g>

      {/* Circle around compass */}

      {/* Graduations around compass */}
      <g transform={`rotate(${-degreesUp}, ${centerX}, ${centerY})`}>
        {Array.from({ length: 35 }, (_, i) => {
          const angle = (i + 1) * 10
          const isMajor = angle % 30 === 0
          const length = isMajor ? 10 : 6
          const width = isMajor ? 1.5 : 1

          return (
            <line
              key={i}
              x1={centerX}
              y1={4}
              x2={centerX}
              y2={length}
              className={`fill-none ${isMajor ? 'opacity-75' : 'opacity-50'} stroke-neutral-400`}
              strokeWidth={width}
              strokeLinecap="round"
              transform={`rotate(${angle}, ${centerX}, ${centerY})`}
            />
          )
        })}

        <text
          x={centerX}
          y="10"
          textAnchor="middle"
          fontSize="8"
          className="fill-neutral-300 font-semibold"
        >
          N
        </text>
      </g>

      <circle
        cx={centerX}
        cy={centerY}
        r="48"
        strokeWidth="1.5"
        className="fill-none stroke-neutral-400 opacity-50"
      />

      {degreesPointer !== undefined && (
        <line
          x1={centerX}
          y1={23}
          x2={centerX}
          y2={5}
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-neutral-100"
          transform={`rotate(${degreesPointer - degreesUp}, ${centerX}, ${centerY})`}
        />
      )}
    </svg>
  )
}
