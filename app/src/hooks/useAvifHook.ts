import { useCallback, useEffect, useState } from "preact/hooks"
import LocalStorage from "../utils/LocalStorage"

const useAvifHook = () => {
  const [useAvif, setUseAvif] = useState(true)

  const updateAvif = useCallback((value: boolean) => {
    setUseAvif(value)
    LocalStorage.storeUseAvif(value)
  }, [])

  useEffect(() => {
    const useAvifDefault = LocalStorage.getUseAvif()
    setUseAvif(useAvifDefault)
  }, [])

  return [useAvif, updateAvif] as const
}

export default useAvifHook
