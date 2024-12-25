import { type FC, type JSX, useCallback } from "preact/compat"
import useAvifHook from "../hooks/useAvifHook"

const HomeView: FC = () => {
  const [useAvif, updateAvif] = useAvifHook()

  const onUseAvifChange = useCallback(
    (event: JSX.TargetedEvent<HTMLInputElement, Event>) => {
      if (event?.target === null) {
        return
      }
      const eventTarget = event?.target as HTMLInputElement
      if (eventTarget?.checked === null) {
        return
      }
      const value = eventTarget.checked
      updateAvif(value)
    },
    [updateAvif],
  )

  return (
    <div className="lg:max-w-screen-xl lg:mx-auto mx-4">
      <h1 className="text-xl font-black text-center mt-8 mb-6">iNatViewer</h1>
      <form
        className="p-4 flex flex-col items-center"
        action="/observations"
        method="GET"
      >
        <input
          className="block w-full max-w-prose p-2 border border-gray-500"
          name="url"
          type="text"
          placeholder="URL"
          value="https://www.inaturalist.org/observations?q=huey.xyz&search_on=tags&user_id=hueyl&per_page=200"
        />
        <div className="w-full max-w-prose flex gap-4 my-4">
          <input
            type="checkbox"
            id="useAvif"
            onChange={onUseAvifChange}
            checked={useAvif}
          />
          <label for="useAvif">
            Load images in AVIF format for smaller file size (uncheck this&nbsp;
            <a href="https://caniuse.com/avif">
              if you are using an old web browser such as IE11
            </a>
            )
          </label>
        </div>
        <button
          className="my-4 py-2 px-4 bg-gray-200 border border-gray-700 rounded"
          type="submit"
        >
          VIEW OBSERVATIONS
        </button>
        <p>
          Not sure what to do?&nbsp;
          <a href="#how-to-use">Read this.</a>
        </p>
      </form>
      <section className="container mx-auto">
        <h2 className="text-xl font-bold">What is this?</h2>
        <p>
          iNatViewer lets you view images in iNaturalist observations in a
          simple, aesthetically-pleasing photo gallery.{" "}
        </p>
      </section>
      <section className="mt-6 container mx-auto mb-12" id="how-to-use">
        <h2 className="text-xl font-bold">How do I use this?</h2>
        <p>
          Visit the&nbsp;
          <a href="https://www.inaturalist.org/observations">Observations</a>
          &nbsp;tab on iNaturalist and tweak the search however you like. You
          can narrow the search to a particular user, region, or by particular
          tags for example. Once you are done, copy the URL and paste it in the
          input box above, then click "VIEW OBSERVATIONS".
        </p>
      </section>
    </div>
  )
}

export default HomeView
