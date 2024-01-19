import React, { useState } from 'react';

const NewOrder = () => {
  const [location, setLocation] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [deliveryDatetime, setDeliveryDatetime] = useState('');
  const [products, setProducts] = useState([{ Product_Code: '', qty_per_uom: '' }]);

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const handleAddProduct = () => {
    setProducts([...products, { Product_Code: '', qty_per_uom: '' }]);
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newOrder = {
      Location: location,
      Order_date: orderDate,
      Delivery_datetime: deliveryDatetime,
      Products: products,
    };

    // Logic to save formData to the database or perform other actions
    fetch('http://localhost:9000/orders', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder)
    }).then(() => {
        console.log('New Order submitted:', newOrder);
    })  
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Location:
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
      </label>
      <br />
      <label>
        Order Date:
        <input type="text" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
      </label>
      <br />
      <label>
        Delivery Datetime:
        <input
          type="text"
          value={deliveryDatetime}
          onChange={(e) => setDeliveryDatetime(e.target.value)}
        />
      </label>
      <br />
      <h3>Products:</h3>
      {products.map((product, index) => (
        <div key={index}>
          <label>
            Product Code:
            <input
              type="text"
              value={product.Product_Code}
              onChange={(e) => handleProductChange(index, 'Product_Code', e.target.value)}
            />
          </label>
          <label>
            Qty Per UOM:
            <input
              type="text"
              value={product.qty_per_uom}
              onChange={(e) => handleProductChange(index, 'qty_per_uom', e.target.value)}
            />
          </label>
          {index > 0 && (
            <button type="button" onClick={() => handleRemoveProduct(index)}>
              Remove Product
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={handleAddProduct}>
        Add Product
      </button>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default NewOrder;
