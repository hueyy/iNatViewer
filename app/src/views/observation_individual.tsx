import type { FC } from "preact/compat"
import { useCallback, useEffect, useState } from "preact/hooks"
import { type Observation, getObservationByURL } from "../api"
import PhotosCarousel from "../components/PhotosCarousel"
import { LOADING_MESSAGES } from "../utils/Constants"

const LoadingScreen = () => {
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
  const loadingMessage = LOADING_MESSAGES[loadingMessageIndex]
  useEffect(() => {
    const rerunTimer = () => {
      return setTimeout(
        () => {
          rerunTimer()
          setLoadingMessageIndex(
            Math.floor((LOADING_MESSAGES.length - 1) * Math.random()) + 1,
          )
        },
        Math.random() * 3000 + 250,
      )
    }
    const timeoutId = rerunTimer()

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className="bg-[rgba(0,0,0,0.6)] z-50 w-full py-12 px-4 lg:px-6 fixed top-[40%] flex justify-center items-center text-white font-black text-2xl">
      {loadingMessage}...
      <svg
        class="animate-spin ml-4 h-8 w-8 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <title>Loading animation</title>
        <circle
          class="opacity-30"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-100"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

type Props = {
  params: {
    id: string
  }
}

const ObservationIndividualView: FC<Props> = (props) => {
  const id = props?.params?.id
  const [observation, setObservation] = useState({} as Observation)
  const [loading, setLoading] = useState(true)

  const onLoaded = useCallback(() => {
    setLoading(false)
  }, [])

  const observationStillLoading =
    typeof observation?.id === "undefined" || observation?.id === null

  useEffect(() => {
    if (typeof id === "undefined" || id === null || id.length === 0) {
      window.history.back()
    } else {
      const observationURL = `https://www.inaturalist.org/observations/${id}.json`
      ;(async () => {
        const data = await getObservationByURL(observationURL)
        setObservation(data)
      })()
    }
  }, [id])

  return (
    <div>
      {loading ? <LoadingScreen /> : null}
      {!observationStillLoading &&
      observation?.observation_photos.length > 0 ? (
        <PhotosCarousel observation={observation} onLoaded={onLoaded} />
      ) : null}
    </div>
  )
}

export default ObservationIndividualView
