import { useCallback, useState } from "preact/hooks"

const useHDReadyHook = () => {
  const [hdReady, setHdReady] = useState(false)

  const onLoad = useCallback(() => {
    setHdReady(true)
  }, [])

  return [hdReady, onLoad] as const
}

export default useHDReadyHook
