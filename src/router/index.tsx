import { Layout } from 'components';
import { HomePage } from 'pages';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

const router = (
  <Route element={<Layout />}>
    <Route path="/" element={<HomePage />} />
    <Route path="*" element={<HomePage />} />
  </Route>
);

const baseRouter = createBrowserRouter(createRoutesFromElements(router));
export default baseRouter;
