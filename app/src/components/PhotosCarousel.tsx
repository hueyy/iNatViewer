import { CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/solid"
import type { FC, TargetedEvent } from "preact/compat"
import { useCallback, useEffect, useRef, useState } from "preact/hooks"
import type { Observation } from "../api"
import { getName } from "../utils"
import CarouselControls from "./CarouselControls"
import CarouselSlide from "./CarouselSlide"
import LocationLink from "./LocationLink"
import PhotoPreviews from "./PhotoPreviews"

type BottomDisplayProps = {
  className?: string
  observation: Observation
  currentIndex: number
}

const BottomDisplay: FC<BottomDisplayProps> = ({
  className,
  observation,
  currentIndex,
}) => {
  const name = getName(observation)

  const rawTimestamp = observation.time_observed_at
  const timestamp = `${(new Date(rawTimestamp)).toDateString()}, ${(new Date(rawTimestamp)).toLocaleTimeString()}`
  const locationString = observation.place_guess
  const { latitude, longitude } = observation
  const { observation_photos: photos } = observation

  return (
    <div className={`w-full absolute bottom-0 left-0 quick-fade ${className}`}>
      {photos.length > 1 ? (
        <PhotoPreviews
          className={className}
          photos={photos}
          currentIndex={currentIndex}
        />
      ) : null}
      <div className="py-4 px-6 bg-black/60 text-white">
        <a
          className="text-white no-underline font-bold"
          href={`https://www.inaturalist.org/observations/${observation.id}`}
        >
          {name}
        </a>
        <div className="text-sm mt-2">
          <div className="flex" title={rawTimestamp}>
            <div className="w-6">
              <CalendarDaysIcon className="size-4" />
            </div>
            <div>{timestamp}</div>
          </div>
          <div className="flex mt-1">
            <div className="w-6">
              <MapPinIcon className="size-4" />
            </div>
            <div>
              <LocationLink
                location={locationString}
                lat={latitude}
                long={longitude}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type Props = {
  observation: Observation
  onLoaded: () => void
}

const PhotosCarousel: FC<Props> = ({ observation, onLoaded }) => {
  if (typeof observation === "undefined" || observation === null) {
    console.error("PhotosCarousel: no observation provided")
    return null
  }

  const { observation_photos: photos } = observation

  if (typeof photos === "undefined" || photos === null || photos.length === 0) {
    console.error("PhotosCarousel: no observation_photos provided")
    return null
  }

  const [currentIndex, setCurrentIndex] = useState(0)

  const [controlsVisible, setControlsVisible] = useState(true)
  const toggleControlsVisible = useCallback(() => {
    setControlsVisible((c) => !c)
  }, [])

  const visibilityClass = controlsVisible
    ? "visible opacity-100"
    : "invisible opacity-0"

  const onScroll = useCallback(
    (e: TargetedEvent) => {
      if (e.target === null) {
        return
      }
      const { scrollLeft, scrollWidth } = e.target as EventTarget & {
        scrollLeft: number
        scrollWidth: number
      }
      const width = Math.round(scrollWidth / photos.length)

      if (
        scrollLeft === 0 ||
        scrollWidth % scrollLeft === 0 ||
        Math.abs(width - (scrollWidth % scrollLeft)) / width < 0.05
      ) {
        const scrollPosition = Math.round(
          scrollLeft / (scrollWidth / photos.length),
        )
        setCurrentIndex(scrollPosition)
      }
    },
    [photos.length],
  )

  const scrollDivRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    document.addEventListener("wheel", (e) => {
      const wheelDelta = (e as WheelEvent & { wheelDelta: number }).wheelDelta
      const delta = Math.max(-1, Math.min(1, wheelDelta))
      if (scrollDivRef.current) {
        scrollDivRef.current.scrollLeft -=
          (delta * scrollDivRef.current.clientWidth) / 3
      }
      e.preventDefault()
    })

    const onKeyDown = (e: KeyboardEvent) => {
      if (!scrollDivRef.current || e.repeat === true) {
        return
      }

      const { key } = e
      switch (key) {
        case "ArrowUp":
        case "ArrowLeft":
          scrollDivRef.current.scrollLeft -= scrollDivRef.current.clientWidth
          break

        case "ArrowDown":
        case "ArrowRight":
          scrollDivRef.current.scrollLeft += scrollDivRef.current.clientWidth
          break
      }
    }

    document.addEventListener("keydown", onKeyDown)
  }, [])

  return (
    <div className="w-full h-screen">
      <ol
        className="w-screen h-screen flex overflow-x-scroll scroll-smooth snap-x"
        onScroll={onScroll}
        onClick={toggleControlsVisible}
        onKeyPress={toggleControlsVisible}
        ref={scrollDivRef}
      >
        {photos.map((p) => (
          <CarouselSlide key={p.photo.id} photo={p.photo} onLoaded={onLoaded} />
        ))}
      </ol>
      <CarouselControls
        className={visibilityClass}
        photo={photos[currentIndex].photo}
      />
      <BottomDisplay
        className={visibilityClass}
        observation={observation}
        currentIndex={currentIndex}
      />
    </div>
  )
}

export default PhotosCarousel
