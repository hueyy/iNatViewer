import type { TargetedEvent } from "preact/compat"
import { useCallback, useEffect, useRef, useState } from "preact/hooks"

const useCarouselScroll = (length: number) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [controlsVisible, setControlsVisible] = useState(true)
  const toggleControlsVisible = useCallback(() => {
    setControlsVisible((c) => !c)
  }, [])
  const scrollDivRef = useRef<HTMLOListElement>(null)

  const onScroll = useCallback(
    (e: TargetedEvent) => {
      if (e.target === null) {
        return
      }
      const { scrollLeft, scrollWidth } = e.target as EventTarget & {
        scrollLeft: number
        scrollWidth: number
      }

      const width = Math.round(scrollWidth / length)
      const difference = scrollLeft % width

      if (
        scrollLeft === 0 ||
        scrollWidth % scrollLeft === 0 ||
        difference < width / 20 ||
        Math.abs(width - difference) < width / 20
      ) {
        const scrollPosition = Math.round(scrollLeft / (scrollWidth / length))
        setCurrentIndex(scrollPosition)
      }
    },
    [length],
  )

  useEffect(() => {
    document.addEventListener("wheel", (e) => {
      const wheelDelta = (e as WheelEvent & { wheelDelta: number }).wheelDelta
      const delta = Math.max(-1, Math.min(1, wheelDelta))
      if (scrollDivRef.current) {
        scrollDivRef.current.scrollLeft -=
          (delta * scrollDivRef.current.clientWidth) / 3
      }
      e.preventDefault()
    })

    const onKeyDown = (e: KeyboardEvent) => {
      if (!scrollDivRef.current || e.repeat === true) {
        return
      }

      const { key } = e
      switch (key) {
        case "ArrowUp":
        case "ArrowLeft":
          scrollDivRef.current.scrollLeft -= scrollDivRef.current.clientWidth
          break

        case "ArrowDown":
        case "ArrowRight":
          scrollDivRef.current.scrollLeft += scrollDivRef.current.clientWidth
          break
      }
    }

    document.addEventListener("keydown", onKeyDown)
  }, [])

  return {
    controlsVisible,
    toggleControlsVisible,
    onScroll,
    scrollDivRef,
    currentIndex,
  } as const
}

export default useCarouselScroll
