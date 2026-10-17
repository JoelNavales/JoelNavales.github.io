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
const base = import.meta.env.BASE_URL;
const basePath = base.replace(/\/$/, '');

// Static hosts redirect directory entries to a trailing slash. Normalize these before
// routing so page titles, active navigation, and the existing clean links stay consistent.
const pathname = window.location.pathname;
if (pathname !== base && pathname.startsWith(`${basePath}/`) && pathname.endsWith('/')) {
  window.history.replaceState(
    null,
    '',
    `${pathname.replace(/\/+$/, '')}${window.location.search}${window.location.hash}`,
  );
}

const isHome = [base, basePath].includes(window.location.pathname);
const legacyTarget = isHome && legacyRoutes[window.location.hash];
if (legacyTarget) window.history.replaceState(null, '', `${basePath}${legacyTarget}`);

const router = createBrowserRouter(
  [
    {
      element: <App />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: '/work', element: <WorkPage /> },
        { path: '/about', element: <AboutPage /> },
        { path: '*', element: <Navigate to="/" replace /> },
      ],
    },
  ],
  { basename: base },
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
