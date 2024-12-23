import fs from "node:fs"
import fastifyMultipart from "@fastify/multipart"
import Fastify from "fastify"
import sharp from "sharp"

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 8001

const fastify = Fastify({
  logger: true,
})

fastify.register(fastifyMultipart, {
  limits: {
    files: 1,
    fields: 1,
    fileSize: 3000000, // 3MB
  },
  attachFieldsToBody: true,
})

fastify.get("/api/", async (_, response) => {
  response.type("application/json").code(200)
  return { hello: "world" }
})

fastify.post("/api/convert_image/", async (request, response) => {
  const formData = await request.formData()
  const image = formData.get("image")
  const id = formData.get("id")

  if (typeof id !== "string" || !image) {
    response.code(400)
    return "Invalid input"
  }

  const outputFolder = "app/dist/images"
  const newFilePath = `${outputFolder}/${id}.avif`
  const alreadyExists = fs.existsSync(newFilePath)

  if (alreadyExists) {
    response.type("application/json").code(200)
    return { path: `/images/${id}.avif` }
  }

  const inputBuffer = await (image as File).arrayBuffer()

  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder)
  }

  await sharp(inputBuffer).avif({ quality: 70 }).toFile(newFilePath)

  response.type("application/json").code(200)
  return { path: `/images/${id}.avif` }
})

fastify.listen({ port: PORT }, (err, address) => {
  if (err) {
    throw err
  }
  console.log(`Server is now listening on ${address}`)
})
