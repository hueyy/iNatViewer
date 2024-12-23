import { ErrorBoundary, LocationProvider, Route, Router } from "preact-iso"
import HomeView from "./views/home"
import ObservationIndividualView from "./views/observation_individual"
import ObservationsListView from "./views/observations_list"

export function App() {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <Router>
          <Route path="/" component={HomeView} />
          <Route path="/observations" component={ObservationsListView} />
          <Route
            path="/observation/:id"
            component={ObservationIndividualView}
          />
        </Router>
      </ErrorBoundary>
    </LocationProvider>
  )
}
