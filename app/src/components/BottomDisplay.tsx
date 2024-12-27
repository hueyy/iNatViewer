import { CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/solid"
import type { FC } from "preact/compat"
import type { iNatViewerPhoto } from "../api"
import LocationLink from "./LocationLink"
import ObservationName from "./ObservationName"
import PhotoPreviews from "./PhotoPreviews"

type BottomDisplayProps = {
  className?: string
  currentIndex: number
  photos: iNatViewerPhoto[]
}

const BottomDisplay: FC<BottomDisplayProps> = ({
  className,
  currentIndex,
  photos,
}) => {
  const observation = photos[currentIndex].observation
  const rawTimestamp = observation.time_observed_at
  const timestamp = `${(new Date(rawTimestamp)).toDateString()}, ${(new Date(rawTimestamp)).toLocaleTimeString()}`
  const locationString = observation.place_guess
  const { latitude, longitude } = observation

  return (
    <div className={`w-full absolute bottom-0 left-0 quick-fade ${className}`}>
      {photos.length > 1 ? (
        <PhotoPreviews
          className={className}
          photos={photos}
          currentIndex={currentIndex}
        />
      ) : null}
      <div className="py-4 px-6 bg-black/60 text-white">
        <a
          className="text-white no-underline font-bold"
          href={`https://www.inaturalist.org/observations/${observation.id}`}
        >
          <ObservationName observation={observation} />
        </a>
        <div className="text-sm mt-2">
          <div className="flex" title={rawTimestamp}>
            <div className="w-6">
              <CalendarDaysIcon className="size-4" />
            </div>
            <div>{timestamp}</div>
          </div>
          <div className="flex mt-1">
            <div className="w-6">
              <MapPinIcon className="size-4" />
            </div>
            <div>
              <LocationLink
                location={locationString}
                lat={latitude}
                long={longitude}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BottomDisplay
