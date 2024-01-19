import { createContext, useReducer } from "react";
import { productsReducer } from "../reducers/productsReducer";

export const ProductsContext = createContext();

const ProductsContextProvider = (props) => {

  const [ state, dispatch ] = useReducer(productsReducer, {products:null})

  return (
    <ProductsContext.Provider value={{ ...state, dispatch }}>
      {props.children}
    </ProductsContext.Provider>
  );
};

export default ProductsContextProvider;
