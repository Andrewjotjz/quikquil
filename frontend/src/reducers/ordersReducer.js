export const ordersReducer = (state, action) => {
    switch (action.type) {
      case 'SET_ORDERS':
        // Update the state with the fetched orders from the action payload
        return {
            orders: action.payload
        };
  
      case 'CREATE_ORDER':
        // Update state with the new order created from the action payload
        return {
            orders: [...state.orders, action.payload]
        };
  
      case 'UPDATE_ORDER':
        // Update state with the modified order from the action payload
        return {
          orders: action.payload
        };
  
      case 'DELETE_ORDER':
        // Update state by removing the deleted order from the orders array
        return {
          orders: action.payload
        };
  
      default:
        return state;
    }
  };
  