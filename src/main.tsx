import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import WorkPage from './pages/WorkPage';
import AboutPage from './pages/AboutPage';
import './styles.css';
import './page-transitions.css';

// Preserve links shared before the portfolio was split into separate pages.
const legacyRoutes: Record<string, string> = {
  '#home': '/',
  '#work': '/work',
  '#skills': '/work#skills',
  '#about': '/about',
  '#contact': '/about#contact',
};
const legacyTarget = window.location.pathname === '/' && legacyRoutes[window.location.hash];
if (legacyTarget) window.history.replaceState(null, '', legacyTarget);

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/work', element: <WorkPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
