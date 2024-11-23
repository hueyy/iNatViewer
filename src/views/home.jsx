const HomeView = () => {
  return (
    <div>
      <h1>
        iNatViewer
      </h1>
      <form action="/observations" method="GET">
        <input name="url" type="text" placeholder="URL" value="https://www.inaturalist.org/observations?q=huey.xyz&user_id=hueyl" />
        <button type="submit">VIEW OBSERVATIONS</button>
        <p>
          Not sure what to do?&nbsp;
          <a href="#how-to-use">Read this.</a>
        </p>
      </form>
      <section>
        <h2>What is this?</h2>
        <p>iNatViewer is...</p>
      </section>
      <section id="how-to-use">
        <h2>How do I use this?</h2>
        <p>
          Visit the&nbsp;
          <a href="https://www.inaturalist.org/observations">Observations</a>
          &nbsp;tab on iNaturalist and tweak the search however you like.
          You can narrow the search to a particular user, region, or by particular tags for example.
          Once you are done, copy the URL and paste it in the input box above, then click "VIEW OBSERVATIONS".
        </p>
      </section>
    </div>
  )
}

export default HomeView