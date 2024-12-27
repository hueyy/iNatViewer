import type { FC } from "preact/compat"
import type { Observation } from "../api"

const ObservationName: FC<{ observation: Observation }> = ({ observation }) => {
  if (!observation || !observation.taxon) {
    return ""
  }
  const { name: scientificName } = observation.taxon
  const commonName = observation.taxon?.common_name?.name
  if (commonName && scientificName) {
    return (
      <>
        {commonName} (<em>{scientificName}</em>)
      </>
    )
  }
  if (commonName) {
    return <>commonName</>
  }
  return <em>{scientificName}</em>
}

export default ObservationName
