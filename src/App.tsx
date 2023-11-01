import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { RouterPathEnum } from 'shared';

import ScenePage from './pages/ScenePage';
import { ErrorPage, MainPage, RootLayout } from './pages';

import './App.css';
import 'sanitize.css';

const router = createBrowserRouter([
  {
    path: RouterPathEnum.Main,
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <MainPage /> },
      {
        path: RouterPathEnum.Scene,
        element: <ScenePage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
