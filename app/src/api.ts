import axios from "axios"

export type ObservationPhoto = {
  attribution: string
  created_at: string
  id: number
  large_url: string
  license_code: string
  small_url: string
  medium_url: string
  square_url: string
  thumb_url: string
}

export type Observation = {
  id: number
  taxon: {
    id: number
    name: string
    rank: string
    common_name: {
      id: number
      name: string
    }
  }
  time_observed_at: string
  uri: string
  license: string
  longitude: string
  latitude: string
  place_guess: string
  photos: ObservationPhoto[]
  observation_photos: {
    photo: ObservationPhoto
  }[]
}

export const getObservationsbyURL = async (
  url: string,
): Promise<Observation[]> => {
  const { data } = await axios.get(url)
  return data
}

export const getObservationByURL = async (
  url: string,
): Promise<Observation> => {
  const { data } = await axios.get(url)
  return data
}

export const getAvifURL = (url: string, id: number): string =>
  `/api/convert_image_url/?url=${url}&id=${id}`

// export const getAvifURL = async (url: string, id: number): Promise<string> => {
//   const { data } = await axios.post("/api/convert_image_url/", {
//     url,
//     id: `${id}`,
//   })
//   const path = data.path
//   return path
// }
