import axios from 'axios'

export const getObservationsbyURL = async (url) => {
  const { data } = await axios.get(url)
  return data
}

export const getObservationByURL = async (url) => {
  const { data } = await axios.get(url)
  return data
}