import { createContext, useReducer } from "react";
import { orderHistoryReducer } from "../reducers/orderHistoryReducer";

export const OrderHistoryContext = createContext();

const OrderHistoryContextProvider = (props) => {

  const [ state, dispatch4 ] = useReducer(orderHistoryReducer, [])

  return (
    <OrderHistoryContext.Provider value={{ ...state, dispatch4 }}>
      {props.children}
    </OrderHistoryContext.Provider>
  );
};

export default OrderHistoryContextProvider;
