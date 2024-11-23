import { useLocation } from "preact-iso"
import { useEffect, useState } from "preact/hooks"
import { getObservationByURL } from "../api"

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
      <h1>
        ObservationIndividualView
      </h1>
      {
        observation?.observation_photos.map(p => (
          <img src={p?.photo?.large_url} />
        ))
      }
    </div>
  )
}

export default ObservationIndividualView