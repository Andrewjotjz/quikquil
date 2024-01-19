import { createContext, useReducer } from "react";
import { ordersReducer } from "../reducers/ordersReducer";

export const OrdersContext = createContext();

const OrdersContextProvider = (props) => {

  const [ state, dispatch3 ] = useReducer(ordersReducer, [])

  return (
    <OrdersContext.Provider value={{ ...state, dispatch3 }}>
      {props.children}
    </OrdersContext.Provider>
  );
};

export default OrdersContextProvider;
