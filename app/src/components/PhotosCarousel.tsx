import type { FC } from "preact/compat"
import type { Observation, iNatViewerPhoto } from "../api"
import useCarouselScroll from "../hooks/useCarouselScroll"
import BottomDisplay from "./BottomDisplay"
import CarouselControls from "./CarouselControls"
import CarouselSlide from "./CarouselSlide"

type Props = {
  observations: Observation[]
  onLoaded: () => void
}

const PhotosCarousel: FC<Props> = ({ observations, onLoaded }) => {
  if (
    typeof observations === "undefined" ||
    observations === null ||
    observations.length === 0
  ) {
    console.error("PhotosCarousel: no observation provided")
    return null
  }

  if (observations.length === 1) {
    const { observation_photos: photos } = observations[0]

    if (
      typeof photos === "undefined" ||
      photos === null ||
      photos.length === 0
    ) {
      console.error("PhotosCarousel: no observation_photos provided")
      return null
    }
  }

  const photos = observations.reduce((prev, cur) => {
    prev.push(
      ...cur.photos.map((p) => ({
        observation: cur,
        photo: p,
      })),
    )
    return prev
  }, [] as iNatViewerPhoto[])

  const {
    controlsVisible,
    toggleControlsVisible,
    onScroll,
    scrollDivRef,
    currentIndex,
  } = useCarouselScroll(photos.length)

  const visibilityClass = controlsVisible
    ? "visible opacity-100"
    : "invisible opacity-0"

  return (
    <div className="w-full h-screen">
      <ol
        className="w-screen h-screen flex overflow-x-scroll scroll-smooth snap-x"
        onScroll={onScroll}
        onClick={toggleControlsVisible}
        onKeyPress={toggleControlsVisible}
        ref={scrollDivRef}
      >
        {photos.map((p) => (
          <CarouselSlide key={p.photo.id} photo={p.photo} onLoaded={onLoaded} />
        ))}
      </ol>
      <CarouselControls
        className={visibilityClass}
        photo={photos[currentIndex].photo}
      />
      <BottomDisplay
        className={visibilityClass}
        currentIndex={currentIndex}
        photos={photos}
      />
    </div>
  )
}

export default PhotosCarousel
