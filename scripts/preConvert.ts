import fs from "node:fs"
import type { Observation } from "../app/src/api"
import { getOriginalPhoto } from "../app/src/utils"
import { convertImage } from "../server/utils"

const inputURLs = fs
  .readFileSync("./scripts/preConvert-urls.txt", "utf-8")
  .split("\n")

const fetchObservations = async (url: string): Promise<Observation[]> => {
  const data = (await (await fetch(url)).json()) as Observation[]
  return data
}

const init = async () => {
  for (const url of inputURLs) {
    const observations = await fetchObservations(url)
    for (const observation of observations) {
      for (const image of observation.photos) {
        console.log((await convertImage(image.small_url)).path)
        console.log((await convertImage(image.medium_url)).path)
        console.log(
          (await convertImage(getOriginalPhoto(image.large_url))).path,
        )
      }
    }
  }
}

init()
