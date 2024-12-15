import type { FC } from "preact/compat"

const HomeView: FC = () => {
  return (
    <div>
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
          value="https://www.inaturalist.org/observations?q=huey.xyz&user_id=hueyl"
        />
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
        <p>iNatViewer is...</p>
      </section>
      <section className="mt-6 container mx-auto" id="how-to-use">
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
