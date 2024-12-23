import Busboy from "busboy"
import sharp from "sharp"

const stream2Buffer = async (
  stream: ReadableStream | null,
): Promise<Buffer> => {
  if (stream === null) {
    return Buffer.of(0)
  }
  const buffers = []
  for await (const data of stream) {
    buffers.push(data as unknown as never)
  }
  const finalBuffer = Buffer.concat(buffers)
  return finalBuffer
}

type FormData = {
  image?: {
    filename: string
    type: string
    content: Buffer
  }
}

const parseFormDataFile = (
  headers: Record<string, string>,
  body: Buffer,
): Promise<FormData> =>
  new Promise((resolve, reject) => {
    const fields = {}
    try {
      const bb = Busboy({
        headers,
        limits: {
          files: 1,
          fields: 0,
        },
      })
      bb.on("file", (name, file, info) => {
        const { filename, mimeType } = info
        file.on("data", (data) => {
          if (!fields[name]) fields[name] = []
          fields[name].push({
            filename,
            type: mimeType,
            content: data,
          })
        })
      })
      bb.on("field", (fieldName, value) => {
        fields[fieldName] = value
      })
      bb.on("close", () => {
        resolve(fields)
      })
      bb.end(body)
      //Buffer.from(body, "base64")
    } catch (error) {
      reject(error)
    }
  })

export default async (request: Request) => {
  if (request.method !== "POST") {
    return new Response("Wrong method", {
      status: 400,
    })
  }
  const headers = Object.fromEntries(request.headers)
  const body = await stream2Buffer(request.body)

  try {
    const formData = await parseFormDataFile(headers, body)
    if (!formData?.image) {
      return new Response("Invalid input", {
        status: 400,
      })
    }

    const input = formData.image.content

    const output = await sharp(input).avif({ quality: 80 }).toBuffer()
    return new Response(output, {
      headers: {
        "cache-control": "public, s-maxage=3600",
        "content-type": "image/avif",
        "content-length": `${output.length}`,
      },
    })
  } catch (error) {
    console.error(error)
    return new Response("Invalid input", {
      status: 400,
    })
  }
}

export const config = { path: "/convert_image", cache: "manual" }
