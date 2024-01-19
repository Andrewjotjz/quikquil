import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ProductsContextProvider from "./contexts/ProductsContext";
import OrdersContextProvider from "./contexts/OrdersContext";
import ProjectsContextProvider from "./contexts/ProjectsContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ProductsContextProvider>
      <OrdersContextProvider>
        <ProjectsContextProvider>
          <App />
        </ProjectsContextProvider>
      </OrdersContextProvider>
    </ProductsContextProvider>
  </React.StrictMode>
);

