
const Cart = ({ isOpen, onClose, cartData, handleRemoveProduct }) => {


  return (
    <div style={{ display: isOpen ? 'block' : 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: '20px' }}>
        <h2>New Order Summary</h2>

        { cartData && cartData.length === 1 && Object.values(cartData[0]).every(value => value === '') ? 
        (<div>
          <label>Cart is empty</label>
        </div>)
         : 
         (cartData.map((product, index) => (
          <label key={index}>
            {`${product.Product_Code} - ${product.Product_Name} - Qty:${product.Qty_per_UOM} (${product.Product_UOM})`}
            <button type="button" onClick={() => handleRemoveProduct(index)}>
              Remove Product
            </button>
          </label>
        )))
        }

        <br />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Cart;
