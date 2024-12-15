import { useLocation } from "preact-iso"
import type { FC } from "preact/compat"
import { useEffect, useState } from "preact/hooks"
import type { Observation } from "../api"
import { getObservationsbyURL } from "../api"
import { getName } from "../utils"

const initialString = "https://www.inaturalist.org/observations"
// TODO: accept variations to URL and make this more robust

type ObservationItemProps = {
  observation: Observation
}

const ObservationItem: FC<ObservationItemProps> = ({ observation }) => {
  const id = observation?.id
  const name = getName(observation)
  const image = observation.photos[0].large_url.replace(
    /large\.jpeg$/,
    "original.jpeg",
  )

  return (
    <a
      className="aspect-square bg-no-repeat bg-cover group"
      href={`/observation/${id}`}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="text-center bg-[rgb(0,0,0,0.7)] h-full w-full flex text-white justify-center items-center p-4 opacity-0 group-hover:opacity-100 group-active:opacity-100">
        {name}
      </div>
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

  return (
    <div>
      <form
        className="py-2 px-4 flex flex-col lg:flex-row items-center"
        action="/observations"
        method="GET"
      >
        <input
          className="w-full max-w-prose p-2 border border-gray-500"
          name="url"
          type="text"
          placeholder="URL"
          value={url}
        />
        <button
          className="my-4 py-2 px-4 bg-gray-200 border border-gray-700 rounded"
          type="submit"
        >
          VIEW OBSERVATIONS
        </button>
      </form>
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {observations.map((o) => (
          <ObservationItem key={o.id} observation={o} />
        ))}
      </div>
    </div>
  )
}

export default ObservationsListView
