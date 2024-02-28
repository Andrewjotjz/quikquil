import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useOrdersContext } from '../hooks/useOrdersContext'
import { useProductsContext } from '../hooks/useProductsContext'
import { useProjectsContext } from '../hooks/useProjectsContext'

import Cart from '../pages/Cart';

const NewOrder = () => {
  
const history = useHistory();

const [selectedProductCode, setSelectedProductCode] = useState('');
const [selectedProductQty, setSelectedProductQty] = useState('');
const [isModalOpen, setModalOpen] = useState(false);
const [ishideFilter, setishideFilter] = useState(true);
const [orderNo, setOrderNo] = useState('');
const [newProject, setProject] = useState('');
const [location, setLocation] = useState('');
const [supplier, setSupplier] = useState('');
const [orderDate, setOrderDate] = useState('');
const [deliveryDatetime, setDeliveryDatetime] = useState('');
const [installationCategory, setInstallationCategory] = useState([]);
const [checkedCategory, setcheckedCategory] = useState([]);
const [newProducts, setProducts] = useState([{ Product_Code: '', Product_Name: '', Supplier_Name: '', Qty_per_UOM: '', Product_UOM: '' }]);

const {products, dispatch} = useProductsContext();
const [isPendingProducts, setIsPendingProducts] = useState(true);
const [error_Products, setError_Products] = useState(null);
const [isPendingProjects, setIsPendingProjects] = useState(true);
const [error_Projects, setError_Projects] = useState(null);
const {projects, dispatch2 } = useProjectsContext();
const {orders, dispatch3} = useOrdersContext();
const [isPendingOrders, setIsPendingOrders] = useState(true);
const [error_Orders, setError_Orders] = useState(null);

// Define mapping between suppliers and allowed Installation Categories
const installationCategoryOptions = {
  'Bell Plaster': ['Plasterboard', 'Framing Wall', 'Framing Ceiling', 'Insulation', 'Compound', 'Fasterner','Others'],
  'Intex': ['Framing Ceiling','Fasterner','Others'],
  'SpeedPanel': ['SpeedPanel'],
  'AllFasterner': ['Fasterner', 'Others'],
  'Hilti': ['Fasterner', 'Others'],
  'CSP Plasterboard' : ['Insulation','Fasterner', 'Others'],
  'K8' : ['Plasterboard', 'Framing Wall', 'Framing Ceiling', 'Insulation', 'Compound', 'Fasterner','Others'],
  'Comfab' : ['Framing Ceiling', 'Others'],
  'Demar H Hardware' : ['Others'],
  'Prostud' : ['Others']
};
  
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
  const abortCont = new AbortController();

  // setTimeout(() => {
    fetch('/api/orders', { signal: abortCont.signal })
    .then(res3 => {
      if (!res3.ok) { // error coming back from server
        throw Error('could not fetch the data for that resource: "/api/orders". Please check your database connection.');
      } 
      return res3.json();
    })
    .then(data3 => {
      setIsPendingOrders(false);
      dispatch3({type: 'SET_ORDERS', payload: data3})
      setError_Orders(null);
    })
    .catch(err3 => {
      if (err3.name === 'AbortError') {
      } else {
        // auto catches network / connection error
        setIsPendingOrders(false);
        setError_Orders(err3.message)
      }
    })
  // }, 3000);

  // abort the fetch
  return () => abortCont.abort();
}, [dispatch3])

const handleOpenModal = () => {
  setModalOpen(true);
};

const handleCloseModal = () => {
  setModalOpen(false);
};

//When checkbox is checked, handle changes
const handleCheckboxChange = (e) => {
  if (e.target.value === "Select All" && e.target.checked) {
    setcheckedCategory(installationCategoryOptions[supplier]);
    return
  }
  else if (e.target.value === "Select All" && !e.target.checked) {
    setcheckedCategory([])
    return
  }
  setcheckedCategory((prevCheckedCategory) => {
    const updatedCategories = new Set(prevCheckedCategory);

    if (!e.target.checked) {
      updatedCategories.delete(e.target.value);
    } else {
      updatedCategories.add(e.target.value);
      document.getElementById('chk-selectall').checked = false;
    }
    return Array.from(updatedCategories);
  });
};


//When Supplier selection changes, change filter options and reset product form
const handleSupplierChange = (value) => {

  //to display checkboxes based on specific supplier
  setInstallationCategory(installationCategoryOptions[value])
  setishideFilter(false);
  document.getElementById('chk-selectall').checked = true;

  //if 1st item has a product selected, we prompt user to confirm changes
  if (newProducts[0].Product_Code !== '') {
    const shouldRemoveSelectedProducts = window.confirm(
      'Are you sure you want to change supplier? All your selected products in your cart will be removed.'
    );
    //if user clicks OK, clear all selected products, add first product entry
    if (shouldRemoveSelectedProducts) {
      //clear all selected products
      newProducts.splice(0, newProducts.length)
      //add first product input entry 
      setSelectedProductCode('')
      setSelectedProductQty('')
      setProducts([{ Product_Code: '', Product_Name: '', Supplier_Name: '', Qty_per_UOM: '', Product_UOM: '' }]);
    }
    else{
      //if user clicks 'Cancel', nothing happens
      setSupplier(supplier)
      return;
    }
  }
  //take advantage of this event to generate a new Order Number
  generateOrderNumber();
  //else if 1st item is empty, without prompt, we change the value of supplier filter
  setSupplier(value);
  //and we reset the 1st item selected
  setSelectedProductCode('')
  setSelectedProductQty('')
  newProducts[0]={ Product_Code: '', Product_Name: '', Supplier_Name: '', Qty_per_UOM: '', Product_UOM: '' };
}

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
}

//'Remove Product' button, removes a row of TextBox from the form
const handleRemoveProduct = (index) => {
    const updatedProducts = [...newProducts];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
};

//When user wants to edit quantity in Cart
const handleEditQty = (index, newQty) => {
  const updatedProducts = [...newProducts];
  updatedProducts[index].Qty_per_UOM = newQty
  setProducts(updatedProducts)
}

const handleClickProduct = () => {
  if (supplier === '') {
    // Error notification
    alert(`Please select supplier`)
    return
  }
}

const generateOrderNumber = () => {
    //In this example, slice() is used to create a shallow copy of the orders array before sorting it. This prevents the original array from being modified. 
    //The sort method takes a comparison function as an argument, and the function subtracts b.Order_No from a.Order_No. 
    //This ensures that the array is sorted in ascending order based on the Order_No property.
    //If you want to sort in descending order, you can swap a.Order_No - b.Order_No with b.Order_No - a.Order_No:
  // Sort the orders based on the Order_No property in ascending order
  const sortedOrders = orders.slice().sort((a, b) => a.Order_No - b.Order_No);
  const lastOrderNumber = orders.length === 0 ? 2000 : sortedOrders[sortedOrders.length - 1].Order_No;
  const newOrderNumber = lastOrderNumber + 1;

  // Ensure the order number does not exceed the limit
  if (newOrderNumber > 99999.99999) {
    alert('Order number limit exceeded. Please contact your IT Support.');
    return;
  }
  setOrderNo(newOrderNumber);
};

// Handle form submission
const handleSubmit = (e) => {
    e.preventDefault();
    
    //check if products are added to cart
    if (newProducts.length === 0 || (newProducts.length === 1 && Object.values(newProducts[0]).every(value => value === ''))) {
      alert("No products were added. Please select products and add to cart.");
      return;
    }

    //check if user is ready to submit a new order
    const shouldConfirm = window.confirm(
      'Submit this order?'
    );

    //if user clicks OK, clear all selected products, add first product entry
    if (shouldConfirm) {
      //create Order object
      const newOrder = {
        Order_No: orderNo,
        Project_ID: newProject,
        Location: location,
        Order_date: orderDate,
        Delivery_datetime: deliveryDatetime,
        Products: newProducts,
        Order_status: "Pending Confirmation"
      };

      // Logic to save formData to the database or POST existing Order object to database
      fetch('/api/orders/create', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder)
      }).then(() => {
          dispatch3({type: 'CREATE_ORDER', payload: newOrder})
          history.push('/orders');
      })
      // Order submitted notification
      toast.success(`New order successfully submitted!`, {
        position: "top-right"
      });
      return
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

return isPendingProducts || isPendingProjects || isPendingOrders ?  (<div>Loading data...</div>) : (
  <div>
    <form onSubmit={handleSubmit} className='new-order-form'>
      <h1>New Order</h1>

      <div>
        <label>
          {
          `New Order No: ${orders && orders.length === 0 ? 2001 : 
          orders.slice().sort((a, b) => a.Order_No - b.Order_No)[orders.slice().sort((a, b) => a.Order_No - b.Order_No).length - 1].Order_No + 1}`
          }
        </label>
      </div>

      <div>
        <label>
          Project:
          <select value={newProject} onChange={(e) => setProject(e.target.value)} required>
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
          <input required type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          Supplier Name:
          <select value={supplier} onChange={(e) => handleSupplierChange(e.target.value)}>
            <option value="" disabled>Select a supplier</option>
            <option value="Bell Plaster">Bell Plaster</option>
            <option value="Intex">Intex</option>
            <option value="SpeedPanel">SpeedPanel</option>
            <option value="AllFasterner">AllFasterner</option>
            <option value="Hilti">Hilti</option>
            <option value="CSP Plasterboard">CSP Plasterboard</option>
            <option value="K8">K8</option>
            <option value="Comfab">Comfab</option>
            <option value="Demar H Hardware">Demar H Hardware</option>
            <option value="Prostud">Prostud</option>
          </select>
        </label>
      </div>

      <br />

      <div>
        <label>
          Order Date:
          <input required type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
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
            onChange={(e) => setDeliveryDatetime(e.target.value)}
          />
        </label>
      </div>

      <br />
      
      <div className='new-order-product-filter'>
      <h3>Products:</h3>
        <fieldset id="fieldset-filter" hidden={ishideFilter}>
          <legend>Apply Filter:</legend>
            <input type='checkbox'id='chk-selectall' value="Select All" onChange={(e) => handleCheckboxChange(e)}/>
            <label>Select All</label>
          { installationCategory && installationCategory.map((category,index) => (
            <div key={index}>
              <input type='checkbox' value={category} onChange={(e) => handleCheckboxChange(e)}/>
              <label>{category}</label>
            </div>
          )) }
        </fieldset>
      </div>
      
      <div className='new-order-select-products'>
        <label>
          Product Code:
          <select value={selectedProductCode} onChange={(e) => handleSelectedProduct(e.target.value)} onClick={handleClickProduct}>
            <option value="" disabled>
              Select a product
            </option>
            {products && products.filter((product) => product.Supplier_Name === supplier && checkedCategory.includes(product.Installation_Category)).map((product) => (
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
      <br />
      <button type="submit">Submit</button>
    </form>


    <br />
    <div className='new-order-cart'>
      <button type="button" onClick={handleOpenModal}>
        Show Cart
      </button>
      <Cart isOpen={isModalOpen} onClose={handleCloseModal} cartData={newProducts} handleRemoveProduct={handleRemoveProduct} handleEditQty={handleEditQty}/>
    </div>
  </div>
  );
};

export default NewOrder;