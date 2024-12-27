import type { FC } from "preact/compat"
import { useCallback } from "preact/hooks"
import type { ObservationPhoto } from "../api"

type PhotoPreviewProps = {
  className: string
  photo: { photo: ObservationPhoto }
}

const PhotoPreview: FC<PhotoPreviewProps> = ({ className, photo }) => {
  const newHash = `#${photo.photo.id}`

  const onClick = useCallback(() => {
    history.replaceState("", "", newHash)
  }, [newHash])

  return (
    <a
      href={newHash}
      className={`${className} no-underline shadow-2xl border border-black/20`}
      onClick={onClick}
    >
      <img
        className={"aspect-square"}
        src={photo.photo.square_url}
        alt={photo.photo.attribution}
        loading="lazy"
      />
    </a>
  )
}

type PhotoPreviewsProps = {
  className?: string
  photos: { photo: ObservationPhoto }[]
  currentIndex: number
}

const PhotoPreviews: FC<PhotoPreviewsProps> = ({
  className,
  photos,
  currentIndex,
}) => {
  const selectedPhotoClassName = "w-8 h-8 md:w-14 md:h-14 opacity-100"
  const normalPhotoClassName = "w-6 h-6 md:w-10 md:h-10 opacity-70"

  const currentSelection =
    currentIndex < 2
      ? photos.slice(0, 7)
      : photos.slice(currentIndex - 3, currentIndex + 4)

  return (
    <div
      className={`w-full flex justify-center items-center gap-2 md:gap-3 pb-4 ${className}`}
    >
      {currentSelection.map((photo) => {
        const photoClassName =
          photo.photo.id === photos[currentIndex].photo.id
            ? selectedPhotoClassName
            : normalPhotoClassName
        return (
          <PhotoPreview
            key={photo.photo.id}
            className={`${photoClassName} shrink-0`}
            photo={photo}
          />
        )
      })}
    </div>
  )
}

export default PhotoPreviews
