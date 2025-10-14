import { useState, useEffect, useMemo } from 'react'
import * as SunCalc from 'suncalc'
import { Compass } from './Compass'
import { format } from 'date-fns'
import { Altitude } from './Altitude'

const toDegrees = (radians: number) => radians * (180 / Math.PI)

export const App = () => {
  const [now, setNow] = useState(new Date())
  const [coordinates, setCoordinates] = useState<GeolocationCoordinates | null>(null)
  const [heading, setHeading] = useState<number | null>(null)

  useEffect(() => {
    setInterval(() => {
      setNow(new Date())
    }, 60 * 1000)
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) return

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCoordinates(position.coords)
      },
      (error) => {
        console.error('Error watching location:', error)
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  useEffect(() => {
    const handleOrientation = ({
      absolute,
      alpha,
      webkitCompassHeading
    }: DeviceOrientationEvent & { webkitCompassHeading?: number }) => {
      if (webkitCompassHeading !== undefined) {
        setHeading(webkitCompassHeading)
      } else if (absolute && alpha !== null) {
        setHeading(360 - alpha)
      }
    }

    const supportsAbsolute = Object.prototype.hasOwnProperty.call(window, 'ondeviceorientationabsolute')
    const event = supportsAbsolute ? 'deviceorientationabsolute' : 'deviceorientation'

    window.addEventListener(event, handleOrientation)

    return () => {
      window.removeEventListener(event, handleOrientation)
    }
  }, [])

  const times = useMemo(() => {
    if (!coordinates) return null
    return SunCalc.getMoonTimes(now, coordinates.latitude, coordinates.longitude)
  }, [now, coordinates])

  const { azimuthDegrees, altitudeDegrees } = useMemo(() => {
    if (!coordinates) {
      return { altitudeDegrees: 0, azimuthDegrees: 0 }
    }

    const position = SunCalc.getMoonPosition(now, coordinates.latitude, coordinates.longitude)

    return {
      altitudeDegrees: toDegrees(position.altitude),
      azimuthDegrees: (toDegrees(position.azimuth) + 360) % 360
    }
  }, [now, coordinates])

  const { phaseEmoji } = useMemo(() => {
    const { phase } = SunCalc.getMoonIllumination(now)

    let phaseEmoji = ''
    if (phase < 0.03 || phase > 0.97) {
      phaseEmoji = '🌑' // New Moon
    } else if (phase < 0.25) {
      phaseEmoji = '🌒' // Waxing Crescent
    } else if (phase < 0.28) {
      phaseEmoji = '🌓' // First Quarter
    } else if (phase < 0.5) {
      phaseEmoji = '🌔' // Waxing Gibbous
    } else if (phase < 0.53) {
      phaseEmoji = '🌕' // Full Moon
    } else if (phase < 0.75) {
      phaseEmoji = '🌖' // Waning Gibbous
    } else if (phase < 0.78) {
      phaseEmoji = '🌗' // Last Quarter
    } else {
      phaseEmoji = '🌘' // Waning Crescent
    }

    return { phase, phaseEmoji }
  }, [now])

  return (
    <main className="container mx-auto flex max-w-lg flex-col px-4 pt-16">
      {times ? (
        <div className="mb-8 grid grid-cols-3 items-center gap-4 text-center">
          {times.rise ? <div className="col-1 text-2xl">↑ {format(times.rise, 'HH:mm')}</div> : null}
          <div className="col-2 text-6xl">{phaseEmoji}</div>
          {times.set ? <div className="col-3 text-2xl">↓ {format(times.set, 'HH:mm')}</div> : null}
        </div>
      ) : null}

      <div className="mx-auto w-9/10">
        <Compass
          degreesUp={heading || coordinates?.heading || 0}
          degreesPointer={azimuthDegrees}
        />
      </div>

      <div className="mx-auto w-9/10">
        <Altitude degrees={altitudeDegrees} />
      </div>
    </main>
  )
}
