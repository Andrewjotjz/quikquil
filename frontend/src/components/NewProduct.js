import React, { useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { useProductsContext } from "../hooks/useProductsContext"

const ProductForm = () => {
  const [Product_Code, setProductCode] = useState('');
  const [Product_Name, setProductName] = useState('');
  const [Supplier_Name, setSupplierName] = useState('');
  const [Product_UOM, setUOM] = useState('');
  const [Rate_Ex_GST, setRateExGST] = useState('');
  const [Installation_Category, setInstallationCategory] = useState('');
  const { products, dispatch } = useProductsContext();
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  const [mapInstallationCategories, setMapInstallationCategories] = useState([
    { value: 'Plasterboard', label: 'Plasterboard' },
    { value: 'Framing Wall', label: 'Framing Wall' },
    { value: 'Framing Ceiling', label: 'Framing Ceiling' },
    { value: 'Insulation', label: 'Insulation' },
    { value: 'Others', label: 'Others' },
    { value: 'SpeedPanel', label: 'SpeedPanel' },
    { value: 'Compound', label: 'Compound' },
    { value: 'Fasterner', label: 'Fasterner' },
  ]);

  const history = useHistory();

  // Define mapping between suppliers and allowed Installation Categories
  const installationCategoryOptions = {
    'Bell Plaster': ['Plasterboard', 'Framing Wall', 'Framing Ceiling', 'Insulation', 'Compound', 'Fasterner','Others'],
    'Intex': ['Framing Ceiling','Fasterner','Others'],
    'SpeedPanel': ['SpeedPanel'],
    'AllFasterner': ['Fasterner', 'Others'],
    'Hilti': ['Fasterner', 'Others'],
    'CSP Plasterboard' : ['Insulation','Fasterner', 'Others'],
    'K8' : ['Plasterboard', 'Framing Wall', 'Framing Ceiling', 'Insulation', 'Compound', 'Fasterner','Others'],
    'Comfab' : ['Framing Ceiling'],
    'Demar H Hardware' : ['Others'],
    'Prostud' : ['Others']
  };

  useEffect(() => {
    const abortCont = new AbortController();

    // setTimeout(() => {
      fetch('/api/products', { signal: abortCont.signal })
      .then(res => {
        if (!res.ok) { // error coming back from server
          throw Error('could not fetch the data for that resource: "/api/products". Please check your database connection.');
        } 
        return res.json();
      })
      .then(data => {
        setIsPending(false);
        dispatch({type: 'SET_PRODUCTS', payload: data})
        setError(null);
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          console.log('fetch aborted')
        } else {
          // auto catches network / connection error
          setIsPending(false);
          setError(err.message);
        }
      })
    // }, 1000);

    // abort the fetch
    return () => abortCont.abort();
  }, [dispatch])

  // Update Installation Categories based on the selected supplier
  const handleSupplierChange = (value) => {
    setSupplierName(value)
    const allowedCategories = installationCategoryOptions[value] || [];
    setMapInstallationCategories(allowedCategories.map(category => ({ value: category, label: category })));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { Product_Code, Product_Name, Supplier_Name, Product_UOM, Rate_Ex_GST, Installation_Category };

    fetch('/api/products/create', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    }).then(() => {
      console.log('Form data submitted:', formData);
      history.push('/');
    });
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className='new-product-form'>
      <h1>New Product</h1>

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
            {/* Object.keys --> to pick object's 'property' only --> outputs an array of 'suppliers' */}
            {Object.keys(installationCategoryOptions).map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          UOM:
          <select value={Product_UOM} onChange={(e) => setUOM(e.target.value)} required>
            <option value="" disabled>Select Unit of Measurement</option>
            {/*  'findIndex' to check for the index of the first occurrence of an item with the same Product_UOM. 
            If the current index matches this found index, it means it's the first occurrence, and the item is included in the filtered array. 
            This way, we filter out duplicates based on the Product_UOM property. */}
            {products && products
            .filter((value, index, self) => self.findIndex(item => item.Product_UOM === value.Product_UOM) === index)
            .sort((a, b) => a.Product_UOM.localeCompare(b.Product_UOM))
            .map((value) => (
              <option key={value._id}>
                {value.Product_UOM}
              </option>
            ))}
            <option value="custom">(Custom)</option>
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

      <button type="submit">Submit</button>
    </form>
  );
};

export default ProductForm;
