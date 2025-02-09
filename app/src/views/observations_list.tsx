import { useLocation } from "preact-iso"
import type { FC } from "preact/compat"
import { useEffect, useState } from "preact/hooks"
import type { Observation } from "../api"
import { getAvifURL, getObservationsbyURL } from "../api"
import ObservationName from "../components/ObservationName"
import useAvifHook from "../hooks/useAvifHook"
import useHDReadyHook from "../hooks/useHDReady"

const initialString = "https://www.inaturalist.org/observations"
// TODO: accept variations to URL and make this more robust

type ObservationItemProps = {
  observation: Observation
}

const ObservationItem: FC<ObservationItemProps> = ({ observation }) => {
  const [useAvif] = useAvifHook()
  const [mediumReady, onLoadMedium] = useHDReadyHook()
  const { query } = useLocation()

  const id = observation?.id
  const location = observation.place_guess
  const firstPhoto = observation.photos[0]

  const smallURL = useAvif
    ? getAvifURL(firstPhoto.small_url)
    : firstPhoto.small_url
  const mediumURL = useAvif
    ? getAvifURL(firstPhoto.medium_url)
    : firstPhoto.medium_url

  const queryURL = query.url

  const queryParams = new URLSearchParams(query)

  const urlQueryParamsMatches = queryURL.match(/\?.*$/)
  if (urlQueryParamsMatches !== null) {
    const urlQueryParam = new URLSearchParams(urlQueryParamsMatches[0])
    queryParams.delete("url")
    for (const [key, value] of urlQueryParam.entries()) {
      queryParams.set(key, value)
    }
  }

  return (
    <a
      className="aspect-square relative group"
      href={`/observation/${id}?url=${encodeURIComponent(encodeURIComponent(`${initialString}?${queryParams.toString()}`))}#${firstPhoto.id}`}
      id={`${id}`}
    >
      {mediumReady ? null : (
        <img
          className="absolute w-full h-full object-cover"
          src={smallURL}
          loading="lazy"
          alt={firstPhoto.attribution}
        />
      )}
      <img
        className={`absolute w-full h-full object-cover ${mediumReady ? "visible" : "invisible"}`}
        src={mediumURL}
        onLoad={onLoadMedium}
        alt={firstPhoto.attribution}
        loading="lazy"
      />
      <div className="absolute lg:text-lg text-base text-center bg-[rgb(0,0,0,0.7)] h-full w-full flex text-white justify-center items-center p-4 opacity-0 group-hover:opacity-100 group-active:opacity-100">
        <span>
          <strong className="font-bold">
            <ObservationName observation={observation} />
          </strong>
          {location ? ` in ${location}` : null}
        </span>
      </div>
    </a>
  )
}

type Props = {
  query: {
    url: string
  }
}

const ObservationsListView: FC<Props> = ({ query }) => {
  const [observations, setObservations] = useState<Observation[]>([])
  const { route } = useLocation()

  useEffect(() => {
    const { url } = query
    if (
      typeof url === "undefined" ||
      url === null ||
      !url.startsWith(initialString)
    ) {
      return route("/", true)
    }

    const queryParams = new URLSearchParams(query)

    const urlQueryParamsMatches = url.match(/\?.*$/)
    if (urlQueryParamsMatches !== null) {
      const urlQueryParam = new URLSearchParams(urlQueryParamsMatches[0])
      queryParams.delete("url")
      for (const [key, value] of urlQueryParam.entries()) {
        queryParams.set(key, value)
      }
    }

    const jsonURL = `${initialString}.json?${queryParams.toString()}`
    ;(async () => {
      const data = await getObservationsbyURL(jsonURL)
      setObservations(data)
      if (location.hash.length > 0) {
        setTimeout(() => {
          document.getElementById(location.hash.slice(1))?.scrollIntoView()
        }, 0)
      }
    })()
  }, [query, route])

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 bg-black w-full h-full">
      {observations.map((o) => (
        <ObservationItem key={o.id} observation={o} />
      ))}
    </div>
  )
}

export default ObservationsListView
