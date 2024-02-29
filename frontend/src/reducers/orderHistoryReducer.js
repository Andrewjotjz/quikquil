export const orderHistoryReducer = (state, action) => {
    switch (action.type) {
      case 'SET_ORDER_HISTORY':
        // Update the state with the fetched order history from the action payload
        return {
            order_history: action.payload
        };
  
      case 'CREATE_ORDER_HISTORY':
        // Update state with the new order history created from the action payload
        return {
          order_history: action.payload
        };
  
      case 'UPDATE_ORDER_HISTORY':
        // Update state with the modified order history from the action payload
        return {
          order_history: action.payload
        };
  
      case 'DELETE_ORDER_HISTORY':
        // Update state by removing the deleted order history from the orders array
        return {
          order_history: action.payload
        };
  
      default:
        return state;
    }
  };
  