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
      className="no-underline shadow-2xl border border-black/20"
      onClick={onClick}
    >
      <img
        className={`${className} aspect-square`}
        src={photo.photo.square_url}
        alt={photo.photo.attribution}
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

  return (
    <div
      className={`w-full flex justify-center items-center gap-2 md:gap-3 pb-4 ${className}`}
    >
      {photos.map((photo, index) => {
        const photoClassName =
          index === currentIndex ? selectedPhotoClassName : normalPhotoClassName
        return (
          <PhotoPreview
            key={photo.photo.id}
            className={photoClassName}
            photo={photo}
          />
        )
      })}
    </div>
  )
}

export default PhotoPreviews
