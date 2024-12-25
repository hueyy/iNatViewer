import {
  ArrowUturnLeftIcon,
  CalendarDaysIcon,
  InformationCircleIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid"
import type { FC, TargetedEvent } from "preact/compat"
import { useCallback, useEffect, useRef, useState } from "preact/hooks"
import { type Observation, type ObservationPhoto, getAvifURL } from "../api"
import useAvifHook from "../hooks/useAvifHook"
import useHDReadyHook from "../hooks/useHDReady"
import { getName, getOriginalPhoto } from "../utils"

type CarouselSlideProps = {
  className?: string
  photo: ObservationPhoto
}

const CarouselSlide: FC<CarouselSlideProps> = ({ className = "", photo }) => {
  const [useAvif] = useAvifHook()
  const [hdReady, onLoad] = useHDReadyHook()

  const originalURL = getOriginalPhoto(photo.large_url)
  const hdURL = useAvif ? getAvifURL(originalURL, photo.id) : originalURL

  return (
    <li
      className={`${className} snap-center bg-black w-screen h-screen shrink-0`}
    >
      <picture className="w-full h-full">
        {hdReady ? null : (
          <img
            id={`${photo.id}-preview`}
            className="w-full h-full object-contain"
            src={photo.square_url}
            alt={photo.attribution}
          />
        )}
        <img
          id={`${photo.id}`}
          className={`w-full h-full object-contain ${hdReady ? "visible" : "invisible"}`}
          src={hdURL}
          alt={photo.attribution}
          onLoad={onLoad}
        />
      </picture>
    </li>
  )
}

type CarouselControlsProps = {
  className?: string
  photo: ObservationPhoto
}

const CarouselControls: FC<CarouselControlsProps> = (props) => {
  const { className, photo } = props

  const goBack = useCallback(() => {
    history.back()
  }, [])

  return (
    <div
      className={`w-full absolute top-0 left-0 flex justify-between py-4 px-6 text-white quick-fade ${className}`}
    >
      <ArrowUturnLeftIcon className="size-6 cursor-pointer" onClick={goBack} />
      <a
        className="text-white no-underline"
        href={`https://www.inaturalist.org/photos/${photo.id}`}
      >
        <InformationCircleIcon className="size-6" />
      </a>
    </div>
  )
}

type PhotoPreviewProps = {
  className: string
  photo: { photo: ObservationPhoto }
}

const PhotoPreview: FC<PhotoPreviewProps> = ({ className, photo }) => {
  const newHash = `#${photo.photo.id}`

  const onClick = useCallback(() => {
    history.replaceState("", "", newHash)
  }, [newHash])

  return (
    <a href={newHash} className="no-underline" onClick={onClick}>
      <img
        className={`${className} aspect-square`}
        src={photo.photo.square_url}
        alt={photo.photo.attribution}
      />
    </a>
  )
}

type PhotoPreviewsProps = {
  className?: string
  photos: { photo: ObservationPhoto }[]
  currentIndex: number
}

const PhotoPreviews: FC<PhotoPreviewsProps> = ({
  className,
  photos,
  currentIndex,
}) => {
  const selectedPhotoClassName = "w-8 h-8 md:w-14 md:h-14 opacity-100"
  const normalPhotoClassName = "w-6 h-6 md:w-10 md:h-10 opacity-70"

  return (
    <div
      className={`w-full flex justify-center items-center gap-2 md:gap-3 pb-4 ${className}`}
    >
      {photos.map((photo, index) => {
        const photoClassName =
          index === currentIndex ? selectedPhotoClassName : normalPhotoClassName
        return (
          <PhotoPreview
            key={photo.photo.id}
            className={photoClassName}
            photo={photo}
          />
        )
      })}
    </div>
  )
}

type LocationLinkProps = {
  location: string
  lat: string
  long: string
}

const LocationLink: FC<LocationLinkProps> = ({ location, lat, long }) => {
  if (
    typeof lat === "string" &&
    typeof long === "string" &&
    typeof location === "string"
  ) {
    return (
      <>
        <a
          className="text-white no-underline"
          href={`https://www.openstreetmap.org/search?lat=${lat}&lon=${long}&zoom=16`}
        >
          {location}
        </a>
        &nbsp; (
        <a
          className="text-white no-underline"
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${long}`}
        >
          Google Maps
        </a>
        )
      </>
    )
  }
  if (typeof location === "string") {
    return <>{location}</>
  }
  return (
    <>
      {lat}, {long}
    </>
  )
}

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
}

const PhotosCarousel: FC<Props> = ({ observation }) => {
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
          <CarouselSlide key={p.photo.id} photo={p.photo} />
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
