import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ProductsContextProvider from "./contexts/ProductsContext";
import OrdersContextProvider from "./contexts/OrdersContext";
import ProjectsContextProvider from "./contexts/ProjectsContext";
import OrderHistoryContextProvider from './contexts/OrderHistoryContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ProductsContextProvider>
      <OrdersContextProvider>
        <OrderHistoryContextProvider>
          <ProjectsContextProvider>
            <App />
          </ProjectsContextProvider>
        </OrderHistoryContextProvider>
      </OrdersContextProvider>
    </ProductsContextProvider>
  </React.StrictMode>
);

