import React from 'react';
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';

import { RouterPathEnum } from 'shared';

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
        loader: () => {
          return redirect(RouterPathEnum.Scene);
        },
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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
