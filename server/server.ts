import fs from "node:fs"
import fastifyCaching from "@fastify/caching"
import Fastify, { type FastifyRequest } from "fastify"
import sharp from "sharp"

const PORT = process.env.BACKEND_PORT
  ? Number.parseInt(process.env.BACKEND_PORT, 10)
  : 8001
const OUTPUT_FOLDER = process.env.OUTPUT_FOLDER || "app/public/images"
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
    const id = request?.query?.id

    if (
      typeof id !== "string" ||
      typeof url !== "string" ||
      !url.startsWith("https://inaturalist-open-data.s3.amazonaws.com/photos/")
      // super secure 🔒
    ) {
      response.code(400)
      return "Invalid input"
    }

    const newFileName = url.split("/").slice(-2).join("-")
    const newFilePath = `${OUTPUT_FOLDER}/${newFileName}.avif`
    const alreadyExists = fs.existsSync(newFilePath)

    if (!alreadyExists) {
      const inputBuffer = await (await fetch(url)).arrayBuffer()

      if (!fs.existsSync(OUTPUT_FOLDER)) {
        fs.mkdirSync(OUTPUT_FOLDER)
      }

      await sharp(inputBuffer).avif({ quality: 85 }).toFile(newFilePath)
    }

    response
      .etag(newFileName, ETAG_CACHE_TIME)
      .code(301)
      .redirect(`/images/${newFileName}.avif`)
    return
  },
)

fastify.listen({ port: PORT }, (err, address) => {
  if (err) {
    throw err
  }
  console.log(`Server is now listening on ${address}`)
})
