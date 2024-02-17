import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useOrdersContext } from '../hooks/useOrdersContext'
import { useProductsContext } from '../hooks/useProductsContext'
import { useProjectsContext } from '../hooks/useProjectsContext'
import { useOrderHistoryContext } from '../hooks/useOrderHistoryContext';

import Cart from '../pages/Cart';

const UpdateOrder = () => {
  //Retrieve data from OrderDetails
  const uselocation = useLocation();
  const data = uselocation.state || "";

  const history = useHistory();

  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [isFormModified, setFormModified] = useState(false);
  const [selectedProductCode, setSelectedProductCode] = useState('');
  const [selectedProductQty, setSelectedProductQty] = useState('');
  const [isCartModalOpen, setCartModalOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const orderNo = data.Order_No;
  const orderStatus = data.Order_status;
  const [newProject, setProject] = useState(data.Project_ID);
  const [location, setLocation] = useState(data.Location);
  const supplier = data.Products[0].Supplier_Name;
  const [orderDate, setOrderDate] = useState(data.Order_date.split('T')[0]);
  const [deliveryDatetime, setDeliveryDatetime] = useState(data.Delivery_datetime.substring(0, data.Delivery_datetime.lastIndexOf(':')));
  const [installationCategory, setInstallationCategory] = useState(["Plasterboard","Framing Wall", "Framing Ceiling", "Insulation", "Others"]);
  const [newProducts, setProducts] = useState([{ Product_Code: '', Product_Name: '', Supplier_Name: '', Qty_per_UOM: '', Product_UOM: '' }]);

  const {products, dispatch} = useProductsContext();
  const [isPendingProducts, setIsPendingProducts] = useState(true);
  const [error_Products, setError_Products] = useState(null);
  const [isPendingProjects, setIsPendingProjects] = useState(true);
  const [error_Projects, setError_Projects] = useState(null);
  const {projects, dispatch2 } = useProjectsContext();
  const {dispatch3} = useOrdersContext();
  const [error_Orders, setError] = useState(null);
  const {dispatch4} = useOrderHistoryContext();
    
  useEffect(() => {
    const abortCont = new AbortController();

    // setTimeout(() => {
      fetch('/api/products', { signal: abortCont.signal })
      .then(res1 => {
        if (!res1.ok) { // error coming back from server
          throw Error('could not fetch the data for that resource: "/api/products". Please check your database connection.');
        } 
        return res1.json();
      })
      .then(data1 => {
        setIsPendingProducts(false);
        dispatch({type: 'SET_PRODUCTS', payload: data1})
        setError_Products(null);
      })
      .catch(err1 => {
        if (err1.name === 'AbortError') {
        } else {
          // auto catches network / connection error
          setIsPendingProducts(false);
          setError_Products(err1.message);
        }
      })
    // }, 3000);

    // abort the fetch
    return () => abortCont.abort();
  }, [dispatch])

  useEffect(() => {
    const abortCont = new AbortController();

    // setTimeout(() => {
      fetch('/api/projects', { signal: abortCont.signal })
      .then(res2 => {
        if (!res2.ok) { // error coming back from server
          throw Error('could not fetch the data for that resource: "/api/projects". Please check your database connection.');
        } 
        return res2.json();
      })
      .then(data2 => {
        setIsPendingProjects(false);
        dispatch2({type: 'SET_PROJECTS', payload: data2})
        setError_Projects(null);
      })
      .catch(err2 => {
        if (err2.name === 'AbortError') {
        } else {
          // auto catches network / connection error
          setIsPendingProjects(false);
          setError_Projects(err2.message)
        }
      })
    // }, 3000);

    // abort the fetch
    return () => abortCont.abort();
  }, [dispatch2])

  useEffect(() => {
    setProducts(data.Products)
    setSelectedProductQty(1)
  },[data.Products])

  
  const handleOpenCartModal = () => {
    setCartModalOpen(true);
  };

  const handleCloseCartModal = () => {
    setCartModalOpen(false);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleProjectChange = (e) => {
    setProject(e.target.value)
    setFormModified(true);
  }

  const handleLocationChange = (e) => {
    setLocation(e.target.value)
    setFormModified(true);
  }

  const handleOrderDateChange = (e) => {
    setOrderDate(e.target.value)
    setFormModified(true);
  }

  const handleDeliveryDateTimeChange = (e) => {
    setDeliveryDatetime(e.target.value)
    setFormModified(true);
  }

  // When checkbox is checked, handle changes
  const handleCheckboxChange = (e) => {
    // show filter when Supplier Name is 'Bell Plaster'
    console.log(e.target.checked, e.target.value)

    let updatedCategories = [...installationCategory];
    if (e.target.checked) {
      // If checkbox is checked, add the value to the array
      updatedCategories = [...updatedCategories, e.target.value];
    } else {
      // If checkbox is unchecked, remove the value from the array
      updatedCategories = updatedCategories.filter((category) => category !== e.target.value);
    }

    // Log the updated installationCategory array
    setInstallationCategory(updatedCategories)
    setFormModified(false);
  };

  const handleSelectedProduct = (value) => {
    setSelectedProductCode(value);
    setSelectedProductQty('');
  }

  const handleSelectedProductQty = (value) => {
    setSelectedProductQty(value);
  }

  const handleAddToCart = () => {
    if (selectedProductCode === ''){
      // Error notification
      toast.error(`Please select a product`, {
        position: "top-right"
      });
      return
    }

    if (selectedProductQty === ''){
      toast.error(`Please input quantity for '${products.find((product) => product.Product_Code === selectedProductCode).Product_Name}'`, {
        position: "top-right"
      });
      return
    }

    // Count occurrences of the last added Product_Code in the list. If it has more than 1 entry, set duplicate to 'true'
    const isDuplicate = (newProducts.filter((product) => product.Product_Code === selectedProductCode).length > 0);

    // if duplicate is not true, add a new input entry
    if (isDuplicate) {
      // Error notification
      toast.error(`"${products.find((product) => product.Product_Code === selectedProductCode).Product_Name}" is already added to your cart`, {
        position: "top-right"
      });
      return
    }

    // Show Add-to-Cart notification
    toast.success(`"${products.find((product) => product.Product_Code === selectedProductCode).Product_Name}" added to the cart`, {
      position: "top-right"
    });

    let productToAdd = ''
    // Find the selected product from productOptions and update Product_Name and Supplier_Name
    const findProduct = (products && products.find((product) => product.Product_Code === selectedProductCode));
    if (findProduct) {
      productToAdd = {
        Product_Code: selectedProductCode,
        Product_Name: findProduct.Product_Name,
        Supplier_Name: findProduct.Supplier_Name,
        Product_UOM: findProduct.Product_UOM,
        Qty_per_UOM: selectedProductQty
      }
    }
    if (newProducts.length === 0 || Object.values(newProducts[0]).every(value => value === '')) {
      setProducts([productToAdd])
      setSelectedProductCode('')
      setSelectedProductQty(1)
    }
    else {
      setProducts([...newProducts, productToAdd])
      setSelectedProductCode('')
      setSelectedProductQty(1)
    }
    setFormModified(true);
  }

  //'Remove Product' button, removes a product by index from the order
  const handleRemoveProduct = (index) => {
      const updatedProducts = [...newProducts];
      updatedProducts.splice(index, 1);
      setProducts(updatedProducts);
      setFormModified(true);
  };

   //When user wants to edit quantity in Cart
   const handleEditQty = (index, newQty) => {
    const updatedProducts = [...newProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      Qty_per_UOM: newQty
    };
    setProducts(updatedProducts);
    setFormModified(true);
  };

  //'Cancel' button, remove latest entry of order history and return to previous page
  const handleCancel = () => {
    const shouldDeleteOrderHistory = window.confirm(
      'Are you sure you want to leave this page?'
    );
    //if user clicks OK, clear all selected orders, add first product entry
    if (shouldDeleteOrderHistory) {
      history.goBack();
    }
  }


  // Handle form submission
  const handleSubmitUpdate = (e) => {
    e.preventDefault();

    //check if products are added to cart
    if (newProducts.length === 0 || (newProducts.length === 1 && Object.values(newProducts[0]).every(value => value === ''))) {
      alert("No products were added. Please select products and add to cart.");
      return;
    }

    const shouldUpdateOrder = window.confirm(
        'Are you sure you want to make changes to this order?'
      );

    //if user clicks OK, clear all selected products, add first product entry
    if (shouldUpdateOrder) {
      
      //check if products are added to cart
      if (newProducts.length === 1 && Object.values(newProducts[0]).every(value => value === '')) {
      alert("No products were added. Please select products and add to cart.");
      return;
      }

    //create Order History object
    const newHistoryOrder = data;
    newHistoryOrder["Order_update_reason"] = reason;
    newHistoryOrder["Order_update_comment"] = comment;
    // Logic to save existing Order details to Order-History database or POST existing Order object to  Order-History database
    fetch('/api/order_history/create', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newHistoryOrder)
    }).then(() => {
        dispatch4({type: 'CREATE_ORDER_HISTORY', payload: newHistoryOrder})
    })

      //create Order object
      const newOrder = {
      Order_No: orderNo,
      Project_ID: newProject,
      Location: location,
      Order_date: orderDate,
      Delivery_datetime: deliveryDatetime,
      Products: newProducts,
      Order_status: orderStatus
      };

      const abortCont = new AbortController();

      // Logic to save formData to the database or POST existing Order object to database
      fetch('/api/orders/' + data._id, { 
          signal: abortCont.signal, method: 'PATCH',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newOrder) 
      })
      .then(res => {
          if (!res.ok) { // error coming back from server
            throw Error(`could not fetch the data for that resource: "/api/products/${data._id}". PATCH request failed. Please check your database connection.`);
          } 
          return res.json();
        })
        .then(() => {
          dispatch3({type: 'UPDATE_ORDER', payload: newOrder})
          setError(null);
          history.push({
            pathname: "/orderdetails",
            state: data._id
          })
          // Order updated notification
          toast.success(`Order successfully updated!`, {
            position: "top-right"
          });
          return
        })
        .catch(err => {
          if (err.name === 'AbortError') {
          } else {
            // auto catches network / connection error
            setError(err.message);
          }
        })
        setFormModified(false);
      }
  else {
      return
  }
    
};

if (error_Products) {
  return <div>Error: {error_Products}</div>;
}
if (error_Projects) {
  return <div>Error: {error_Projects}</div>;
}
if (error_Orders) {
  return <div>Error: {error_Orders}</div>;
}

return isPendingProducts || isPendingProjects ?  (<div>Loading data...</div>) : (
  <div>
    <form onSubmit={handleSubmitUpdate} className='update-order-form'>
      <h1>Update Order</h1>

      <div>
        <label>
          {
          `New Order No: ${orderNo}`
          }
        </label>
      </div>

      <div>
        <label>
          Project:
          <select value={newProject} onChange={(e) => handleProjectChange(e)} required>
            <option value="" disabled>Select a Project</option>
            {projects &&
            projects.map((project) => (
            <option key={project._id} value={project.Project_ID}>
                {project.Project_ID}
            </option>
            ))
            }
          </select>
        </label>
      </div>

      <div>
        <label>
          Location:
          <input required type="text" value={location} onChange={(e) => handleLocationChange(e)} />
        </label>
      </div>

      <div>
        <label>
          Supplier Name: <input type="text" value={supplier} disabled />
        </label>
      </div>

      <br />

      <div>
        <label>
          Order Date:
          <input required type="date" value={orderDate} onChange={(e) => handleOrderDateChange(e)} />
        </label>
      </div>

      <br />

      <div>
        <label>
          Delivery Datetime:
          <input
            required
            type="datetime-local"
            value={deliveryDatetime}
            onChange={(e) => handleDeliveryDateTimeChange(e)}
          />
        </label>
      </div>

      <br />

      <div className='new-order-product-filter'>
      <h3>Products:</h3>
      <fieldset id="fieldset-filter">
          <legend>Apply Filter:</legend>
            <input type="checkbox" id="chk-plasterboard" name="plasterboard" value="Plasterboard" onChange={(e) => handleCheckboxChange(e)} />
            <label htmlFor="plasterboard">Plasterboard</label>
            <input type="checkbox" id="chk-framing_wall" name="framing_wall" value="Framing Wall" onChange={(e) => handleCheckboxChange(e)}/>
            <label htmlFor="framing_wall">Framing Wall</label>
            <input type="checkbox" id="chk-framing_ceiling" name="framing_ceiling" value="Framing Ceiling" onChange={(e) => handleCheckboxChange(e)}/>
            <label htmlFor="framing_ceiling">Framing Ceiling</label>
            <input type="checkbox" id="chk-insulation" name="insulation" value="Insulation" onChange={(e) => handleCheckboxChange(e)}/>
            <label htmlFor="insulation">Insulation</label>
            <input type="checkbox" id="chk-compound" name="compound" value="Compound" onChange={(e) => handleCheckboxChange(e)}/>
            <label htmlFor="compound">Compound</label>
            <input type="checkbox" id="chk-fasterner" name="fasterner" value="Fasterner" onChange={(e) => handleCheckboxChange(e)}/>
            <label htmlFor="fasterner">Fasterner</label>
            <input type="checkbox" id="chk-speedpanel" name="speedpanel" value="SpeedPanel" onChange={(e) => handleCheckboxChange(e)}/>
            <label htmlFor="speedpanel">SpeedPanel</label>
            <input type="checkbox" id="chk-others" name="others" checked disabled value="Others"/>
            <label htmlFor="others">Others</label>
        </fieldset>
      </div>
      
      <div className='update-order-select-products'>
        <label>
          Product Code:
          <select value={selectedProductCode} onChange={(e) => handleSelectedProduct(e.target.value)}>
            <option value="" disabled>
              Select a product
            </option>
            {products && products.filter((product) => product.Supplier_Name === supplier && installationCategory.includes(product.Installation_Category)).map((product) => (
            <option key={product.Product_Code} value={product.Product_Code}>
                {`${product.Product_Code} ${product.Product_Name}`}
            </option>
            ))} 
          </select>
        </label>
        <label>
          Qty: 
          <input 
            type="number"
            value={selectedProductQty}
            onChange={(e) => handleSelectedProductQty(e.target.value)}
            min={1}
            required
          />
        </label>
        <button id='btn-cart' type="button" onClick={() => handleAddToCart()}>
          Add to Cart
        </button>
      </div>
      <div className='update-order-cart'>
        <button type="button" onClick={handleOpenCartModal}>
          Show Cart
        </button>
      </div>

      <br />
      <button type="button" onClick={handleCancel}>Cancel Update</button>
      {isFormModified && (<button type="button" onClick={handleOpenModal}>Save Changes</button>)}

      { isModalOpen &&
      <div>
        <label>
          Update reason:
          <input required type="text" value={reason} onChange={(e) => setReason(e.target.value)} />
        </label>
        <label>
          Additional comment:
          <input required type="text" value={comment} onChange={(e) => setComment(e.target.value)} />
        </label>
        <button type="submit">Submit</button>
        <button onClick={handleCloseModal}>Cancel</button>
      </div>
      }  

    </form>
    <Cart isOpen={isCartModalOpen} onClose={handleCloseCartModal} cartData={newProducts} handleRemoveProduct={handleRemoveProduct} handleEditQty={handleEditQty}/>
  </div>
  );
};

export default UpdateOrder;