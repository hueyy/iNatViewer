import { useLocation } from "preact-iso"
import { useCallback, useEffect, useState } from "preact/hooks"
import { getObservationByURL } from "../api"
import { InformationCircleIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/solid"

const CarouselSlide = (props) => {
  const { photo } = props
  return (
    <li className={`snap-center bg-black w-screen h-screen shrink-0`}>
      <picture
        className="w-full h-full"
      >
        <source
          srcset={photo.photo.large_url}
          media="(min-width: 600px)"
        />
        <source
          srcset={photo.photo.medium_url}
          media="(min-width: 400px)"
        />
        <img className="w-full h-full object-contain" src={photo.photo.small_url} alt={photo.photo.attribution} />
      </picture>
    </li>
  )
}

const CarouselControls = (props) => {
  const { className, photo } = props

  const location = useLocation()
  const goBack = useCallback(() => {
    location.history.back()
  })

  return (
    <div className={`w-full absolute top-0 left-0 text-white flex justify-between py-4 px-6 quick-fade ${className}`}>
      <ArrowUturnLeftIcon className="size-6 cursor-pointer" onClick={goBack} />
      <a href={`https://www.inaturalist.org/photos/${photo.photo.id}`}>
        <InformationCircleIcon className="size-8" />
      </a>
    </div>
  )
}

const PhotosCarousel = (props) => {
  const { photos } = props

  if (typeof photos === `undefined` || photos === null || photos.length === 0) {
    return null
  }

  const [currentIndex, setCurrentIndex] = useState(0)
  const [controlsVisible, setControlsVisible] = useState(false)
  const onScroll = useCallback((e) => {
    const { scrollLeft, scrollWidth } = e.target
    if (scrollLeft === 0 || scrollWidth % scrollLeft === 0) {
      const scrollPosition = Math.round(scrollLeft / (scrollWidth / photos.length))
      setCurrentIndex(scrollPosition)
    }
  }, [])
  const toggleControlsVisible = useCallback(() => {
    setControlsVisible(c => !c)
  }, [])

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
        className={controlsVisible ? `visible opacity-100` : `invisible opacity-0`}
        photo={photos[currentIndex]}
      />
    </div>
  )
}

const ObservationIndividualView = (props) => {
  const id = props?.params?.id
  const [observation, setObservation] = useState({})
  const location = useLocation()

  useEffect(() => {
    if (typeof id === `undefined` || id === null || id.length === 0) {
      location.history.back()
    } else {
      const observationURL = `https://www.inaturalist.org/observations/248003429.json`;
      (async () => {
        const data = await getObservationByURL(observationURL)
        setObservation(data)
      })()
    }
  }, [id])

  if (typeof observation?.id === `undefined` || observation?.id === null) {
    return (<h1>Loading...</h1>)
  }

  console.log(observation)

  return (
    <div>
      {
        observation?.observation_photos.length > 0
          ? (
            <PhotosCarousel photos={observation.observation_photos} />
          ) : null
      }
    </div>
  )
}

export default ObservationIndividualView