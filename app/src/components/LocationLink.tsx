import type { FC } from "preact/compat"

type LocationLinkProps = {
  location: string
  lat: string
  long: string
}

const LocationLink: FC<LocationLinkProps> = ({ location, lat, long }) => {
  if (
    typeof lat === "string" &&
    typeof long === "string" &&
    typeof location === "string"
  ) {
    return (
      <>
        <a
          className="text-white no-underline"
          href={`https://www.openstreetmap.org/search?lat=${lat}&lon=${long}&zoom=16`}
        >
          {location}
        </a>
        &nbsp; (
        <a
          className="text-white no-underline"
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${long}`}
        >
          Google Maps
        </a>
        )
      </>
    )
  }
  if (typeof location === "string") {
    return <>{location}</>
  }
  return (
    <>
      {lat}, {long}
    </>
  )
}

export default LocationLink
