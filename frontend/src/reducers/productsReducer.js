export const productsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      // Update the state with the fetched products from the action payload
      return {
        products: action.payload
      };

    case 'CREATE_PRODUCT':
      // Update state with the new product created from the action payload
      return {
        products: [...state.products, action.payload]
      };

    case 'UPDATE_PRODUCT':
      // Update state with the modified product from the action payload
      return {
        products: action.payload
      };

    case 'DELETE_PRODUCT':
      // Update state by removing the deleted product from the products array
      return {
        products: action.payload
      };

    default:
      return state;
  }
};
