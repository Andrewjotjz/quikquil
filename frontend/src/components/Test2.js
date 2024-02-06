import React from 'react';

const updatedOrder = {"products": [{"Product_Code": 2001, "Product_Name": "tuna", "Qty_per_UOM": 2}, {"Product_Code": 2003, "Product_Name": "chicken", "Qty_per_UOM": 3}, {"Product_Code": 2005, "Product_Name": "ball", "Qty_per_UOM": 3}]};
const historyOrder = {"products": [{"Product_Code": 2001, "Product_Name": "tuna", "Qty_per_UOM": 2}, {"Product_Code": 2003, "Product_Name": "chicken", "Qty_per_UOM": 1}]};

const DiscrepancyComponent = () => {
  // Find discrepancies
  const discrepancies = [...historyOrder.products.map(updatedProduct => {
    const matchingProduct = updatedOrder.products.find(historyProduct => historyProduct.Product_Code === updatedProduct.Product_Code);
    if (!matchingProduct) {
      return { ...updatedProduct, discrepancy: 'removed' };
    } else if (matchingProduct.Qty_per_UOM !== updatedProduct.Qty_per_UOM) {
      return { ...updatedProduct, discrepancy: 'quantity changed', historyQty_per_UOM: matchingProduct.Qty_per_UOM };
    }
    return null;
  }), ...updatedOrder.products.map(historyProduct => {
    const matchingProduct = historyOrder.products.find(updatedProduct => updatedProduct.Product_Code === historyProduct.Product_Code);
    if (!matchingProduct) {
      return { ...historyProduct, discrepancy: 'added' };
    }
    return null;
  })].filter(Boolean);

  // // Find discrepancies
  // const discrepancies = [...order_history.filter(item => item.Order_No === orders.Order_No).Products.map(updatedProduct => {
  //   const matchingProduct = orders.Products.find(historyProduct => historyProduct.Product_Code === updatedProduct.Product_Code);
  //   if (!matchingProduct) {
  //     return { ...updatedProduct, discrepancy: 'removed' };
  //   } else if (matchingProduct.Qty_per_UOM !== updatedProduct.Qty_per_UOM) {
  //     return { ...updatedProduct, discrepancy: 'quantity changed', historyQty_per_UOM: matchingProduct.Qty_per_UOM };
  //   }
  //   return null;
  // }), ...orders.Products.map(historyProduct => {
  //   const matchingProduct = order_history.filter(item => item.Order_No === orders.Order_No).Products.find(updatedProduct => updatedProduct.Product_Code === historyProduct.Product_Code);
  //   if (!matchingProduct) {
  //     return { ...historyProduct, discrepancy: 'added' };
  //   }
  //   return null;
  // })].filter(Boolean);

  return (
    <div>
      <h3>Updated Order:</h3>
      <ul>
        {updatedOrder.products.map(product => (
          <li key={product.Product_Code}>{product.Product_Name} - Qty: {product.Qty_per_UOM}</li>
        ))}
      </ul>

      <h3>History Order:</h3>
      <ul>
        {historyOrder.products.map(product => (
          <li key={product.Product_Code}>{product.Product_Name} - Qty: {product.Qty_per_UOM}</li>
        ))}
      </ul>

      <h3>Discrepancies:</h3>
      <ul>
        {discrepancies.map(product => (
          <li key={product.Product_Code}>
            {product.Product_Name} - Qty: {product.Qty_per_UOM} ({product.discrepancy})
            {product.discrepancy === 'quantity change' && ` (Previous Qty_per_UOM: ${product.historyQty_per_UOM})`}
          </li>
        ))}
      </ul>

    </div>
  );
};

export default DiscrepancyComponent;

