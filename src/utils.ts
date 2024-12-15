import type { Observation } from "./api"

export const getName = (observation: Observation): string => {
  if (!observation || !observation.taxon) {
    return ""
  }
  const { name: scientificName } = observation.taxon
  const commonName = observation.taxon?.common_name?.name
  if (commonName && scientificName) {
    return `${commonName} (${scientificName})`
  }
  if (commonName) {
    return commonName
  }
  return scientificName
}

export const getOriginalPhoto = (largePhotoUrl: string): string => {
  return largePhotoUrl.replace(/large(\.jpe?g)%/, "original$1")
}
