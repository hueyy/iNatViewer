import { useLocation } from "preact-iso"
import { useEffect, useState } from "preact/hooks"
import { getObservationByURL } from '../api'

const initialString = `https://www.inaturalist.org/observations`
// TODO: accept variations to URL and make this more robust

const ObservationItem = (props) => {
  const id = props?.observation?.id
  const name = props?.observation?.taxon?.name
  return (
    <a className="" href={`/observation/${id}`}>
      <strong>{name}</strong>
    </a>
  )
}

const ObservationsListView = (props) => {
  const url = props?.query?.url
  const [observations, setObservations] = useState([])
  const location = useLocation()

  useEffect(() => {
    if (typeof url === `undefined` || url === null || !url.startsWith(initialString)) {
      location.route('/', { replace: true })
    } else {
      const jsonURL = url.replace(initialString, `${initialString}.json`);
      (async () => {
        const data = await getObservationByURL(jsonURL)
        setObservations(data)
      })()
    }
  }, [url])

  return (
    <div>
      <h1>ObservationsListView</h1>
      <div className="grid grid-cols-4">
        {observations.map(o => <ObservationItem key={o.id} observation={o} />)}
      </div>
    </div>
  )
}

export default ObservationsListView