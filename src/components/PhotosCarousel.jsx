import { InformationCircleIcon, ArrowUturnLeftIcon, CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/solid"
import { useCallback, useState } from "preact/hooks"


const CarouselSlide = (props) => {
  const { photo } = props
  const [srcURL, setSrcURL] = useState(photo.photo.square_url)
  const onLoad = useCallback(() => {
    setSrcURL(photo.photo.large_url)
  }, [])
  return (
    <li className={`snap-center bg-black w-screen h-screen shrink-0`}>
      <picture
        className="w-full h-full"
      >
        <img
          id={photo.photo.id}
          className="w-full h-full object-contain"
          src={srcURL}
          alt={photo.photo.attribution}
          onLoad={onLoad}
        />
      </picture>
    </li>
  )
}

const CarouselControls = (props) => {
  const { className, photo } = props

  const goBack = useCallback(() => {
    history.back()
  })

  return (
    <div className={`w-full absolute top-0 left-0 flex justify-between py-4 px-6 text-white quick-fade ${className}`}>
      <ArrowUturnLeftIcon className="size-6 cursor-pointer" onClick={goBack} />
      <a className="text-white no-underline" href={`https://www.inaturalist.org/photos/${photo.photo.id}`}>
        <InformationCircleIcon className="size-6" />
      </a>
    </div>
  )
}

const getName = (observation) => {
  const commonName = observation?.taxon?.common_name?.name
  const scientificName = observation?.taxon?.name

  if (typeof commonName === `string` && commonName.length > 0) {
    return <>{commonName} (<i>{scientificName}</i>)</>
  }

  return scientificName
}

const PhotoPreviews = (props) => {
  const { className, photos, currentIndex } = props
  return (
    <div className={`w-full flex justify-center items-center gap-3 pb-4 ${className}`}>
      {
        photos.map((photo, index) => (
          <a
            href={`#${photo.photo.id}`}
            className="no-underline"
          >
            <img
              key={photo.photo.id}
              className={`${index === currentIndex ? `w-14 h-14 opacity-100` : `w-10 h-10 opacity-70`} aspect-square`}
              src={photo.photo.square_url}
              alt={photo.photo.attribution}
            />
          </a>
        ))
      }
    </div>
  )
}

const LocationLink = (props) => {
  const { location, lat, long } = props
  if (typeof lat === `string` && typeof long === `string` && typeof location === `string`) {
    return (
      <>
        <a
          className="text-white no-underline"
          href={`https://www.openstreetmap.org/search?lat=${lat}&lon=${long}&zoom=16`}
        >
          {location}
        </a>&nbsp;
        (
        <a
          className="text-white no-underline"
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${long}`}
        >
          Google Maps
        </a>
        )
      </>
    )
  } else if (typeof location === `string`) {
    return <>{location}</>
  } else {
    return (
      <>{lat}, {long}</>
    )
  }
}

const BottomDisplay = (props) => {
  const { className, observation, currentIndex } = props
  const name = getName(observation)

  const rawTimestamp = observation.time_observed_at
  const timestamp = `${(new Date(rawTimestamp)).toDateString()}, ${(new Date(rawTimestamp)).toLocaleTimeString()}`
  const locationString = observation.place_guess
  const { latitude, longitude } = observation
  const { observation_photos: photos } = observation

  return (
    <div className={`w-full absolute bottom-0 left-0 quick-fade ${className}`}>
      <PhotoPreviews
        className={className}
        photos={photos}
        currentIndex={currentIndex}
      />
      <div className="py-4 px-6 bg-black/60 text-white">
        <a
          className="text-white no-underline font-bold"
          href={`https://www.inaturalist.org/observations/${observation.id}`}>
          {name}
        </a>
        <div className="text-sm mt-2">
          <div className="flex" alt={rawTimestamp}>
            <div className="w-6">
              <CalendarDaysIcon className="size-4" />
            </div>
            <div>
              {timestamp}
            </div>
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

const PhotosCarousel = (props) => {
  const { observation } = props

  if (typeof observation === `undefined` || observation === null) {
    console.error(`PhotosCarousel: no observation provided`)
    return null
  }

  const { observation_photos: photos } = observation

  if (typeof photos === `undefined` || photos === null || photos.length === 0) {
    console.error(`PhotosCarousel: no observation_photos provided`)
    return null
  }

  const [currentIndex, setCurrentIndex] = useState(0)
  const [controlsVisible, setControlsVisible] = useState(true)
  const onScroll = useCallback((e) => {
    const { scrollLeft, scrollWidth } = e.target
    const width = Math.round(scrollWidth / photos.length)

    if (scrollLeft === 0 || scrollWidth % scrollLeft === 0 || Math.abs(width - scrollWidth % scrollLeft) / width < 0.05) {
      const scrollPosition = Math.round(scrollLeft / (scrollWidth / photos.length))
      setCurrentIndex(scrollPosition)
    }
  }, [])
  const toggleControlsVisible = useCallback(() => {
    setControlsVisible(c => !c)
  }, [])
  const visibilityClass = controlsVisible ? `visible opacity-100` : `invisible opacity-0`

  return (
    <div className="w-full h-screen">
      <ol
        className="w-screen h-screen flex overflow-x-scroll scroll-smooth snap-x"
        onScroll={onScroll}
        onClick={toggleControlsVisible}
      >
        {
          photos.map(p => (
            <CarouselSlide key={p.photo.id} photo={p} />
          ))
        }
      </ol>
      <CarouselControls
        className={visibilityClass}
        photo={photos[currentIndex]}
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