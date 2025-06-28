import { Toaster } from 'react-hot-toast';
import AppRoute from './routes/AppRoutes';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <AppRoute />
    </>
  );
}

export default App
