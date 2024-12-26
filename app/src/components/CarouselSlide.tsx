import { type FC, useCallback } from "preact/compat"
import { type ObservationPhoto, getAvifURL } from "../api"
import useAvifHook from "../hooks/useAvifHook"
import useHDReadyHook from "../hooks/useHDReady"
import { getOriginalPhoto } from "../utils"

type CarouselSlideProps = {
  className?: string
  photo: ObservationPhoto
  onLoaded: () => void
}

const CarouselSlide: FC<CarouselSlideProps> = ({
  className = "",
  photo,
  onLoaded,
}) => {
  const [useAvif] = useAvifHook()
  const [hdReady, onHDReady] = useHDReadyHook()

  const originalURL = getOriginalPhoto(photo.large_url)
  const hdURL = useAvif ? getAvifURL(originalURL) : originalURL

  const onLoad = useCallback(() => {
    onHDReady()
    onLoaded()
  }, [onHDReady, onLoaded])

  return (
    <li
      className={`${className} snap-center bg-black w-screen h-screen shrink-0`}
    >
      <picture className="w-full h-full">
        {hdReady ? null : (
          <img
            id={`${photo.id}-preview`}
            className="w-full h-full object-contain"
            src={photo.square_url}
            alt={photo.attribution}
          />
        )}
        <img
          id={`${photo.id}`}
          className={`w-full h-full object-contain ${hdReady ? "visible" : "invisible"}`}
          src={hdURL}
          alt={photo.attribution}
          onLoad={onLoad}
        />
      </picture>
    </li>
  )
}

export default CarouselSlide
