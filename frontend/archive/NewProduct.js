import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const ProductForm = () => {
  // State to manage form data
  const [ Product_Code, setProductCode ] = useState('');
  const [ Product_Name, setProductName ] = useState('');
  const [ Supplier_Name, setSupplierName ] = useState('');
  const [ Product_UOM, setUOM ] = useState('');
  const [ Rate_Ex_GST, setRateExGST ] = useState('');
  const [ Installation_Category, setInstallationCategory ] = useState('');

  const history = useHistory();
  
    // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = { Product_Code,Product_Name,Supplier_Name,Product_UOM,Rate_Ex_GST,Installation_Category};

    // Logic to save formData to the database or perform other actions
    fetch('/api/products/create', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    }).then(() => {
        console.log('Form data submitted:', formData);
        history.push('/')
    })    
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Product Code:
        <input type="text" name="Product_Code" value={Product_Code} onChange={(e) => setProductCode(e.target.value)} />
      </label>

      <label>
        Product Name:
        <input type="text" name="Product_Name" value={Product_Name} onChange={(e) => setProductName(e.target.value)} />
      </label>

      <label>
        Supplier Name:
        <select value={Supplier_Name} onChange={(e) => setSupplierName(e.target.value)} required>
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

      <label>
        Rate (Ex GST):
        <input type="number" name="Rate_Ex_GST" step="0.01" min="0.01" value={Rate_Ex_GST} onChange={(e) => setRateExGST(e.target.value)} />
      </label>

      <label>
        Usage:
        <select value={Installation_Category} onChange={(e) => setInstallationCategory(e.target.value)} required>
          <option value="" disabled>Select Usage Type</option>
          <option value="Plasterboard">Plasterboard</option>
          <option value="Framing Wall">Framing Wall</option>
          <option value="Framing Ceiling">Framing Ceiling</option>
          <option value="Insulation">Insulation</option>
          <option value="Others">Others</option>
        </select>
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export default ProductForm;
