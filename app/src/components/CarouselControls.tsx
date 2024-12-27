import {
  ArrowUturnLeftIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid"
import { useLocation, useRoute } from "preact-iso"
import { type FC, useCallback } from "preact/compat"
import type { ObservationPhoto } from "../api"

type CarouselControlsProps = {
  className?: string
  photo: ObservationPhoto
}

const CarouselControls: FC<CarouselControlsProps> = (props) => {
  const { className, photo } = props

  const { query, route } = useLocation()
  const { params } = useRoute()

  const goBack = useCallback(() => {
    if (typeof query?.url === "string") {
      if (typeof params?.id === "string") {
        route(`/observations?url=${query.url}#${params.id}`)
      } else {
        route(`/observations?url=${query.url}`)
      }
    } else {
      history.back()
    }
  }, [query.url, route, params.id])

  return (
    <div
      className={`w-full absolute top-0 left-0 flex justify-between py-4 px-6 text-white quick-fade ${className}`}
    >
      <div className="p-2 bg-black/60 rounded-xl">
        <ArrowUturnLeftIcon
          className="size-6 cursor-pointer"
          onClick={goBack}
        />
      </div>

      <a
        className="text-white no-underline p-2 bg-black/60 rounded-xl"
        href={`https://www.inaturalist.org/photos/${photo.id}`}
      >
        <InformationCircleIcon className="size-6" />
      </a>
    </div>
  )
}

export default CarouselControls
