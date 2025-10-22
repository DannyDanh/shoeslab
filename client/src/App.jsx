import React from 'react';
import { useRoutes } from 'react-router-dom';
import Navigation from './components/Navigation';

import ViewShoes from './pages/ViewShoes';
import EditShoe from './pages/EditShoe';
import CreateShoe from './pages/CreateShoe';
import ShoeDetails from './pages/ShoeDetails';

import './App.css';

const App = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <CreateShoe title="SHOES LAB | Customize" />
    },
    {
      path: '/customshoes',
      element: <ViewShoes title="SHOES LAB | Custom Shoes" />
    },
    {
      path: '/customshoes/:id',
      element: <ShoeDetails title="SHOES LAB | View" />
    },
    {
      path: '/edit/:id',
      element: <EditShoe title="SHOES LAB | Edit" />
    }
  ]);

  return (
    <div className="app">
      <Navigation />
      {element}
    </div>
  );
};

export default App;
