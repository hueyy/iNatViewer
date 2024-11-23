import { LocationProvider, ErrorBoundary, Router } from 'preact-iso'
import HomeView from './views/home'
import ObservationsListView from './views/observations_list'
import ObservationIndividualView from './views/observation_individual'

export function App() {

  return (
    <LocationProvider>
      <ErrorBoundary>
        <Router>
          <HomeView path="/" />
          <ObservationsListView path="/observations" />
          <ObservationIndividualView path="/observation/:id" />
        </Router>
      </ErrorBoundary>
    </LocationProvider>
  )
}
