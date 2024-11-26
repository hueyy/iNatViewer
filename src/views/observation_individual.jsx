import { useLocation } from "preact-iso"
import { useEffect, useState } from "preact/hooks"
import { getObservationByURL } from "../api"
import PhotosCarousel from "../components/PhotosCarousel"

const ObservationIndividualView = (props) => {
  const id = props?.params?.id
  const [observation, setObservation] = useState({})
  const location = useLocation()

  useEffect(() => {
    if (typeof id === `undefined` || id === null || id.length === 0) {
      location.history.back()
    } else {
      const observationURL = `https://www.inaturalist.org/observations/${id}.json`;
      (async () => {
        const data = await getObservationByURL(observationURL)
        setObservation(data)
      })()
    }
  }, [id])

  if (typeof observation?.id === `undefined` || observation?.id === null) {
    return (
      <div className="bg-black w-screen h-screen flex justify-center items-center text-white font-black text-2xl">
        Loading...
      </div>
    )
  }

  return (
    <div>
      {
        observation?.observation_photos.length > 0
          ? (
            <PhotosCarousel
              observation={observation}
            />
          ) : null
      }
    </div>
  )
}

export default ObservationIndividualView