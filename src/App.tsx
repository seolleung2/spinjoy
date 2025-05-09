import { AppProviders } from "./contexts/AppProviders";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <AppProviders>
      <MainPage />
    </AppProviders>
  );
}

export default App;
