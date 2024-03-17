import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { RouterPathEnum } from 'shared';

import LoginPage from './pages/LoginPage';
import ScenePage from './pages/ScenePage';
import { DashboardPage, ErrorPage, MainPage, RootLayout } from './pages';

import './App.css';
import 'sanitize.css';

const router = createBrowserRouter([
  {
    path: RouterPathEnum.Main,
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: RouterPathEnum.Scene,
        element: <ScenePage />,
      },
      {
        path: RouterPathEnum.Dashboard,
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: RouterPathEnum.Auth,
    element: <LoginPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
