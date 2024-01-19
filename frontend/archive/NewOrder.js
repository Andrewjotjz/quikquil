import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useOrdersContext } from '../src/hooks/useOrdersContext'
import { useProductsContext } from '../src/hooks/useProductsContext'
import { useProjectsContext } from '../src/hooks/useProjectsContext'

import Cart from '../src/pages/Cart';

const NewOrder = () => {
  
  const history = useHistory();

  const [isModalOpen, setModalOpen] = useState(false);
  const [orderNo, setOrderNo] = useState('');
  const [newProject, setProject] = useState('');
  const [location, setLocation] = useState('');
  const [supplier, setSupplier] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [deliveryDatetime, setDeliveryDatetime] = useState('');
  const [installationCategory, setInstallationCategory] = useState([])
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
          console.log('fetch aborted')
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
          console.log('fetch aborted')
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
          console.log('fetch aborted')
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

  useEffect(() =>{
    console.log(installationCategory)
  }, [installationCategory])


  
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // When checkbox is checked, handle changes
  const handleCheckboxChange = (e) => {
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
  };

  //When Supplier selection changes, change filter options and reset product form
  const handleSupplierChange = (value) => {

    // show filter when Supplier Name is 'Bell Plaster'
    if (value === 'Bell Plaster'){
      document.getElementById('fieldset-filter').style.display = "block"
      document.getElementById('plasterboard').checked = true;
      document.getElementById('framing_wall').checked = true;
      document.getElementById('framing_ceiling').checked = true;
      setInstallationCategory(['Plasterboard','Framing Wall', 'Framing Ceiling', 'Others'])
    }
    else {
      document.getElementById('fieldset-filter').style.display = "none"
      document.getElementById('plasterboard').checked = false;
      document.getElementById('framing_wall').checked = false;
      document.getElementById('framing_ceiling').checked = false;
      setInstallationCategory([ 'Others'])
    }


    //if 1st item has a product selected, we prompt user to confirm changes
    if (newProducts[0].Product_Code !== '') {
      const shouldRemoveSelectedProducts = window.confirm(
        'Are you sure you want to change supplier? This will reset all your selected products.'
      );
      //if user clicks OK, clear all selected products, add first product entry
      if (shouldRemoveSelectedProducts) {
        //clear all selected products
        newProducts.splice(0, newProducts.length)
        //add first product input entry 
        setProducts([{ Product_Code: '', Product_Name: '', Supplier_Name: '', Qty_per_UOM: '', Product_UOM: '' }]);
      }
      else{
        //if user clicks 'Cancel', nothing happens
        return;
      }
    }
    //take advantage of this event to generate a new Order Number
    generateOrderNumber();
    //else if 1st item is empty, without prompt, we change the value of supplier filter
    setSupplier(value);
    //and we reset the 1st item selected
    newProducts[0]={ Product_Code: '', Product_Name: '', Supplier_Name: '', Qty_per_UOM: '', Product_UOM: '' };
  }

  //Logic to add selected products to product state
  const handleProductChange = (index, field, value) => {

      const updatedProducts = [...newProducts];
      updatedProducts[index][field] = value;

      // Find the selected product from productOptions and update Product_Name and Supplier_Name
      const selectedProduct = (products && products.find((product) => product.Product_Code === value));
      if (selectedProduct) {
        updatedProducts[index].Product_Name = selectedProduct.Product_Name;
        updatedProducts[index].Supplier_Name = selectedProduct.Supplier_Name;
        updatedProducts[index].Product_UOM = selectedProduct.Product_UOM;
      }
      setProducts(updatedProducts);
      console.log(updatedProducts);
  };

  //'Add Product' button, inserts a row of TextBox to the form
  const handleAddProduct = () => {
      // last added product_code variable
      let newProductCode = '';
      // If productList doesn't have 1 item only, get the last added Product_Code
      if (newProducts.length !== 1) {
        newProductCode = newProducts[newProducts.length - 1].Product_Code;
      }

      // Count occurrences of the last added Product_Code in the list. If it has more than 1 entry, set duplicate to 'true'
      const isDuplicate = (newProducts.filter((product) => product.Product_Code === newProductCode).length > 1);

      // if duplicate is not true, add a new input entry
      if (!isDuplicate) {
        setProducts([...newProducts, { Product_Code: '', Product_Name: '', Supplier_Name: '', Qty_per_UOM: '', Product_UOM: '' }]);
      } else {
        //if duplicate is true, show a confirmation prompt
        const shouldRemoveDuplicate = window.confirm(
          `You can't add more than one of the same product. Do you want to remove this duplicate?`
        );
      
      //if user press 'OK'
      if (shouldRemoveDuplicate) {
        // Logic to remove the last added product_code entry
        newProducts.pop();
        // Then, add a new input entry
        setProducts([...newProducts, { Product_Code: '', Product_Name: '', Supplier_Name: '', Qty_per_UOM: '', Product_UOM: '' }]);
        }
      }

  };

  //'Remove Product' button, removes a row of TextBox from the form
  const handleRemoveProduct = (index) => {
      const updatedProducts = [...newProducts];
      updatedProducts.splice(index, 1);
      setProducts(updatedProducts);
  };

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
      alert('Order number limit exceeded.');
      return;
    }
    setOrderNo(newOrderNumber);
  };

  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();


  // -------In this modified handleSubmit function, a Set called duplicateProductCodes is used to keep track of unique Product_Codes. The some function is then used to check if there are any duplicates in the products array. If duplicates are found, an alert is displayed, and the submission process is stopped. If no duplicates are found, the form data is submitted as before.
            //This ensures that the form is not submitted if there are any duplicate Product_Codes in the products array.
  // Check for duplicate Product_Codes in the products array
  const duplicateProductCodes = new Set();
  const isDuplicateProductCode = newProducts.some((product) => 
  {
    if (duplicateProductCodes.has(product.Product_Code)) {
      return true;
    }
    
    duplicateProductCodes.add(product.Product_Code);
    console.log("Checking duplicate Product Code:", duplicateProductCodes)
    return false;
  });

  if (isDuplicateProductCode) {
    alert("You can't add more than one of the same product. Please remove duplicates.");
    return;
  }

  //if no duplicate, create Order object
  const newOrder = {
    Order_No: orderNo,
    Project_ID: newProject,
    Location: location,
    Order_date: orderDate,
    Delivery_datetime: deliveryDatetime,
    Products: newProducts,
  };

  // Logic to save formData to the database or POST existing Order object to database
  fetch('/api/orders/create', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newOrder)
  }).then(() => {
      console.log('New Order submitted:', newOrder);
      dispatch3({type: 'CREATE_ORDER', payload: newOrder})
      history.push('/orders');
  })
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
    <form onSubmit={handleSubmit}>
      <label>
        {
        `New Order No: ${orders && orders.length === 0 ? 2001 : 
        orders.slice().sort((a, b) => a.Order_No - b.Order_No)[orders.slice().sort((a, b) => a.Order_No - b.Order_No).length - 1].Order_No + 1}`
        }
      </label>
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
      <label>
        Location:
        <input required type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
      </label>
      <label>
        Supplier Name:
        <select value={supplier} onChange={(e) => handleSupplierChange(e.target.value)}>
          <option value="" disabled>Select a supplier</option>
          <option value="Bell Plaster">Bell Plaster</option>
          <option value="Intex">Intex</option>
          <option value="SpeedPanel">SpeedPanel</option>
          <option value="AllFasterner">AllFasterner</option>
          <option value="Hilti">Hilti</option>
          <option value="CSP">CSP</option>
          <option value="K8">K8</option>
          <option value="Comfab">Comfab</option>
          <option value="Demar H Hardware">Demar H Hardware</option>
          <option value="Prostud">Prostud</option>
          <option value="United Equipment">United Equipment</option>
        </select>
      </label>
      <br />
      <label>
        Order Date:
        <input required type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
      </label>
      <br />
      <label>
        Delivery Datetime:
        <input
          required
          type="datetime-local"
          value={deliveryDatetime}
          onChange={(e) => setDeliveryDatetime(e.target.value)}
        />
      </label>
      <br />
      <h3>Products:</h3>
      <fieldset hidden id="fieldset-filter">
        <legend>Apply Filter:</legend>
          <input type="checkbox" id="plasterboard" name="plasterboard" value="Plasterboard" onChange={(e) => handleCheckboxChange(e)} />
          <label htmlFor="plasterboard">Plasterboard</label>
          <input type="checkbox" id="framing_wall" name="framing_wall" value="Framing Wall" onChange={(e) => handleCheckboxChange(e)}/>
          <label htmlFor="framing_wall">Framing Wall</label>
          <input type="checkbox" id="framing_ceiling" name="framing_ceiling" value="Framing Ceiling" onChange={(e) => handleCheckboxChange(e)}/>
          <label htmlFor="framing_ceiling">Framing Ceiling</label>
          <input type="checkbox" id="insulation" name="insulation" value="Insulation" onChange={(e) => handleCheckboxChange(e)}/>
          <label htmlFor="insulation">Insulation</label>
          <input type="checkbox" id="others" name="others" checked disabled value="Others"/>
          <label htmlFor="others">Others</label>
      </fieldset>
      {newProducts.map((product, index) => (
        <div key={index}>
          <label>
            Product Code:
            <select value={product.Product_Code} onChange={(e) => handleProductChange(index, 'Product_Code', e.target.value)} required>
                <option value="" disabled>
                    Select a product
                </option>
                {products &&
                products.filter((product) => product.Supplier_Name === supplier && installationCategory.includes(product.Installation_Category)).map((product) => (
                <option key={product.Product_Code} value={product.Product_Code}>
                    {`[${product.Product_Code}] ${product.Product_Name}`}
                </option>
                ))}
            </select>
        </label>
        <label>
            { product.Product_UOM ? `Qty (${product.Product_UOM})` : `Qty: `}
            <input
              type="number"
              value={product.Qty_per_UOM}
              onChange={(e) => handleProductChange(index, 'Qty_per_UOM', e.target.value)}
              min={1}
              required
            />
          </label>
          
          {index > 0 && (
            <button type="button" onClick={() => handleRemoveProduct(index)}>
              Remove Product
            </button>
          )}
        </div>
      ))}
      <button hidden={newProducts[newProducts.length-1].Product_Code === ''} type="button" onClick={handleAddProduct}>
        Add More Products
      </button>

      <br />
      <button type="submit">Submit</button>
    </form>
      <br />
    <button type="button" onClick={handleOpenModal}>
      Show Cart
    </button>
    <Cart isOpen={isModalOpen} onClose={handleCloseModal} cartData={newProducts} handleRemoveProduct={handleRemoveProduct}/>
  </div>
  );
};

export default NewOrder;