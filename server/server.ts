import fastifyCaching from "@fastify/caching"
import Fastify, { type FastifyRequest } from "fastify"
import { convertImage } from "./utils.js"

const PORT = process.env.BACKEND_PORT
  ? Number.parseInt(process.env.BACKEND_PORT, 10)
  : 8001
const ETAG_CACHE_TIME = 31557600000 // 1 year

const fastify = Fastify({
  logger: true,
})

fastify.register(fastifyCaching, {
  privacy: fastifyCaching.privacy.PUBLIC,
})

fastify.get("/api/", async (_, response) => {
  response.type("application/json").code(200)
  return { hello: "world" }
})

type ConvertImageUrlBody = {
  url: string
  id: string
}

fastify.get(
  "/api/convert_image_url/",
  async (
    request: FastifyRequest<{ Querystring: ConvertImageUrlBody }>,
    response,
  ) => {
    const url = request?.query?.url

    if (
      typeof url !== "string" ||
      !url.startsWith("https://inaturalist-open-data.s3.amazonaws.com/photos/")
      // super secure 🔒
    ) {
      response.code(400)
      return "Invalid input"
    }

    const { path, newFileName } = await convertImage(url)

    response.etag(newFileName, ETAG_CACHE_TIME).code(301).redirect(path)
    return
  },
)

fastify.listen({ port: PORT }, (err, address) => {
  if (err) {
    throw err
  }
  console.log(`Server is now listening on ${address}`)
})
