import { useLocation } from "preact-iso"
import type { FC } from "preact/compat"
import { useEffect, useState } from "preact/hooks"
import type { Observation } from "../api"
import { getObservationsbyURL } from "../api"

const initialString = "https://www.inaturalist.org/observations"
// TODO: accept variations to URL and make this more robust

type ObservationItemProps = {
  observation: Observation
}

const ObservationItem: FC<ObservationItemProps> = ({ observation }) => {
  const id = observation?.id
  const name = observation?.taxon?.name
  return (
    <a className="" href={`/observation/${id}`}>
      <strong>{name}</strong>
    </a>
  )
}

type Props = {
  query: {
    url: string
  }
}

const ObservationsListView: FC<Props> = (props) => {
  const url = props?.query?.url
  const [observations, setObservations] = useState<Observation[]>([])
  const location = useLocation()

  useEffect(() => {
    if (
      typeof url === "undefined" ||
      url === null ||
      !url.startsWith(initialString)
    ) {
      location.route("/", true)
    } else {
      const jsonURL = url.replace(initialString, `${initialString}.json`)
      ;(async () => {
        const data = await getObservationsbyURL(jsonURL)
        setObservations(data)
      })()
    }
  }, [url, location.route])

  console.log(observations)

  return (
    <div>
      <h1>ObservationsListView</h1>
      <div className="grid grid-cols-4">
        {observations.map((o) => (
          <ObservationItem key={o.id} observation={o} />
        ))}
      </div>
    </div>
  )
}

export default ObservationsListView
