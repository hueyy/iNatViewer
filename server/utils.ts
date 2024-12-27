import fs from "node:fs"
import sharp from "sharp"

const OUTPUT_FOLDER = process.env.OUTPUT_FOLDER || "app/public/images"

export const convertImage = async (
  url: string,
): Promise<{ path: string; newFileName: string }> => {
  const newFileName = url.split("/").slice(-2).join("-")
  const newFilePath = `${OUTPUT_FOLDER}/${newFileName}.avif`

  if (!fs.existsSync(newFilePath)) {
    try {
      await sharp(fs.readFileSync(newFilePath)).stats()

      if (!fs.existsSync(OUTPUT_FOLDER)) {
        fs.mkdirSync(OUTPUT_FOLDER)
      }
    } catch (error) {
      const inputBuffer = await (await fetch(url)).arrayBuffer()
      await sharp(inputBuffer).avif({ quality: 85 }).toFile(newFilePath)
    }
  }
  return {
    path: `/images/${newFileName}.avif`,
    newFileName,
  }
}
