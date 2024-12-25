import { OPTIONS } from "./Constants"

const storeValue = (key: string, value: unknown): void => {
  localStorage.setItem(key, JSON.stringify(value))
}

const getValue = (key: string): unknown => {
  const rawResult = localStorage.getItem(key)
  if (rawResult !== null) {
    return JSON.parse(rawResult)
  }
  return null
}

const storeUseAvif = (value: boolean) => storeValue(OPTIONS.USE_AVIF, value)
const getUseAvif = (): boolean => {
  const rawResult = getValue(OPTIONS.USE_AVIF)
  if (typeof rawResult !== "boolean") {
    return true
  }
  return rawResult
}

export default {
  getValue,
  storeValue,
  storeUseAvif,
  getUseAvif,
}
