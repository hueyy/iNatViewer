import { useLocation } from "preact-iso"
import type { FC } from "preact/compat"
import { useEffect, useState } from "preact/hooks"
import type { Observation } from "../api"
import { getAvifURL, getObservationsbyURL } from "../api"
import useAvifHook from "../hooks/useAvifHook"
import { getName } from "../utils"

const initialString = "https://www.inaturalist.org/observations"
// TODO: accept variations to URL and make this more robust

type ObservationItemProps = {
  observation: Observation
}

const ObservationItem: FC<ObservationItemProps> = ({ observation }) => {
  const [useAvif] = useAvifHook()

  const id = observation?.id
  const name = getName(observation)
  const location = observation.place_guess
  const firstPhoto = observation.photos[0]

  const smallURL = useAvif
    ? getAvifURL(firstPhoto.small_url, firstPhoto.id)
    : firstPhoto.small_url
  const mediumURL = useAvif
    ? getAvifURL(firstPhoto.medium_url, firstPhoto.id)
    : firstPhoto.medium_url
  const largeURL = useAvif
    ? getAvifURL(firstPhoto.large_url, firstPhoto.id)
    : firstPhoto.large_url

  return (
    <a className="aspect-square relative group" href={`/observation/${id}`}>
      <div
        className="absolute w-full h-full bg-no-repeat bg-cover lg:hidden"
        style={{ backgroundImage: `url(${smallURL})` }}
      />
      <div
        className="absolute w-full h-full bg-no-repeat bg-cover hidden lg:block 2xl:hidden"
        style={{ backgroundImage: `url(${mediumURL})` }}
      />
      <div
        className="absolute w-full h-full bg-no-repeat bg-cover hidden 2xl:block"
        style={{ backgroundImage: `url(${largeURL})` }}
      />
      <div className="absolute lg:text-lg text-base text-center bg-[rgb(0,0,0,0.7)] h-full w-full flex text-white justify-center items-center p-4 opacity-0 group-hover:opacity-100 group-active:opacity-100">
        {name}
        {location ? ` in ${location}` : null}
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
    <div className="grid grid-cols-2 lg:grid-cols-4">
      {observations.map((o) => (
        <ObservationItem key={o.id} observation={o} />
      ))}
    </div>
  )
}

export default ObservationsListView
