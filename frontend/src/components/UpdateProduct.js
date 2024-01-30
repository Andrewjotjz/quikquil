import { useState} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useProductsContext } from "../hooks/useProductsContext"

const UpdateProduct = () => {
  //Retrieve data
  const location = useLocation();
  const data = location.state || "";

  const history = useHistory();

  //Declare all states required
  const {dispatch} = useProductsContext();
  const [error, setError] = useState(null);
  const [Product_Code, setProductCode] = useState(data.Product_Code);
  const [Product_Name, setProductName] = useState(data.Product_Name);
  const [Supplier_Name, setSupplierName] = useState(data.Supplier_Name);
  const [Product_UOM, setUOM] = useState(data.Product_UOM);
  const [Rate_Ex_GST, setRateExGST] = useState(data.Rate_Ex_GST);
  const [Installation_Category, setInstallationCategory] = useState(data.Installation_Category);

  const [mapInstallationCategories, setMapInstallationCategories] = useState([
    { value: 'Plasterboard', label: 'Plasterboard' },
    { value: 'Framing Wall', label: 'Framing Wall' },
    { value: 'Framing Ceiling', label: 'Framing Ceiling' },
    { value: 'Insulation', label: 'Insulation' },
    { value: 'Others', label: 'Others' },
  ]);

  // Define mapping between suppliers and allowed Installation Categories
  const installationCategoryOptions = {
    'Bell Plaster': ['Plasterboard', 'Framing Wall', 'Framing Ceiling', 'Insulation', 'Other'],
    'Intex': ['Plasterboard', 'Framing Wall', 'Framing Ceiling', 'Others'],
    'SpeedPanel': ['Others'],
    'AllFasterner': ['Plasterboard', 'Framing Wall', 'Framing Ceiling', 'Others'],
    'Hilti': ['Plasterboard', 'Framing Wall', 'Framing Ceiling', 'Others'],
    'CSP Plasterboard' : ['Plasterboard', 'Insulation', 'Others'],
    'K8' : ['Insulation', 'Others'],
    'Comfab' : ['Framing Wall', 'Framing Ceiling', 'Others'],
    'Demar H Hardware' : ['Others'],
    'Prostud' : ['Others'],
    'United Equipment' : ['Others']
  };

  // Update Installation Categories based on the selected supplier
  const handleSupplierChange = (value) => {
    setSupplierName(value)
    const allowedCategories = installationCategoryOptions[value] || [];
    setMapInstallationCategories(allowedCategories.map(category => ({ value: category, label: category })));
  };

  const handleRetryConnection = () => {
    //refresh page
    history.go(0)
  }

  const handleSubmitUpdate = (e) => {
    const shouldUpdateProduct = window.confirm(
      'Are you sure you want to make changes to this product?'
    );
    //if user clicks OK, clear all selected products, add first product entry
    if (shouldUpdateProduct) {
      e.preventDefault();
      const formData = { Product_Code, Product_Name, Supplier_Name, Product_UOM, Rate_Ex_GST, Installation_Category };

      const abortCont = new AbortController();
      fetch('/api/products/'+ data._id, { 
          signal: abortCont.signal, method: 'PATCH',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData) 
      })
      .then(res => {
        if (!res.ok) { // error coming back from server
          throw Error(`could not fetch the data for that resource: "/api/products/${data._id}". PATCH request failed. Please check your database connection.`);
        } 
        return res.json();
      })
      .then(() => {
        dispatch({type: 'UPDATE_PRODUCT', payload: formData})
        setError(null);
        console.log('Form data submitted to update with:', formData);
        history.push({
          pathname: "/productdetails",
          state: data._id
      })
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          console.log('fetch aborted')
        } else {
          // auto catches network / connection error
          setError(err.message);
        }
      })
    }
    else {
      e.preventDefault();
      return
    }
  }

if (error) {
    return (
        <div>
            Error: {error}
            <button onClick={handleRetryConnection}>Retry</button>
        </div>

    )
}

  return (
    <form onSubmit={handleSubmitUpdate} className='update-product-form'>
      <h1>Update Product</h1>
      <div>
        <label>
          Product Code:
          <input type="text" name="Product_Code" value={Product_Code} onChange={(e) => setProductCode(e.target.value)} />
        </label>
      </div>
      
      <div>
        <label>
          Product Name:
          <input type="text" name="Product_Name" value={Product_Name} onChange={(e) => setProductName(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          Supplier Name:
          <select value={Supplier_Name} onChange={(e) => handleSupplierChange(e.target.value)} required>
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
            <option value="United Equipment">United Equipment</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          UOM:
          <select value={Product_UOM} onChange={(e) => setUOM(e.target.value)} required>
            <option value="" disabled>Select Unit of Measurement</option>
            <option value="Each">Each</option>
            <option value="Sheet">Sheet</option>
            <option value="Box 1000">Box 1000</option>
            <option value="Box 100">Box 100</option>
            <option value="Pack">Pack</option>
            <option value="Pail">Pail</option>
            <option value="Roll">Roll</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Rate (Ex GST):
          <input type="number" name="Rate_Ex_GST" step="0.01" min="0.01" value={Rate_Ex_GST} onChange={(e) => setRateExGST(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          Usage:
          <select value={Installation_Category} onChange={(e) => setInstallationCategory(e.target.value)} required>
            <option value="" disabled>Select Installation Category</option>
            {mapInstallationCategories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button type="submit">Update</button>
    </form>
  );
};

export default UpdateProduct;
