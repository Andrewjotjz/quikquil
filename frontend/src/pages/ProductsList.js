// import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';

// const Products = ({ products }) => {
//   const history = useHistory();
//   const [searchTerm, setSearchTerm] = useState('');

//   const handleClick = (id) => {
//     history.push({
//       pathname: '/productdetails',
//       state: id,
//     });
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const filteredProducts = products.filter((product) =>
//     Object.values(product).some(
//       (value) =>
//         typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   return (
//     <div className="products-table">
//       <input
//         type="text"
//         placeholder="Search products..."
//         value={searchTerm}
//         onChange={handleSearch}
//       />
//       <table>
//         <thead>
//           <tr>
//             <th>Product Code</th>
//             <th>Product Name</th>
//             <th>Supplier Name</th>
//             <th>UOM</th>
//             <th>Rate Ex GST</th>
//             <th>Installation Category</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredProducts.map((product) => (
//             <tr key={product._id} onClick={() => handleClick(product._id)}>
//               <td>{product.Product_Code}</td>
//               <td>{product.Product_Name}</td>
//               <td>{product.Supplier_Name}</td>
//               <td>{product.Product_UOM}</td>
//               <td>{product.Rate_Ex_GST}</td>
//               <td>{product.Installation_Category}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Products;
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Products = ({ products }) => {
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleClick = (id) => {
    history.push({
      pathname: '/productdetails',
      state: id,
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSupplierChange = (e) => {
    setSelectedSupplier(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // ---- EXPLANATION for 'filteredProducts' ----
//1) Object.values(product): This extracts all the values of the product object as an array. 
// For example, if product is { Product_Code: '123', Product_Name: 'Product A', ... }, Object.values(product) would be ['123', 'Product A', ...].
//2) .some: This array method tests whether at least one element in the array passes the test implemented by the provided function. In this case, it checks if at least one value in the array includes the searchTerm.
//3) (value) => typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase()): This is the test function for Array.some. 
// It checks if the value is a string and if it includes the searchTerm (case-insensitive). 
// The toLowerCase() method is used to perform a case-insensitive comparison.
  const filteredProducts = products.filter((product) => {
    return (
      Object.values(product).some(
        (value) =>
          typeof value === 'string' &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      (selectedSupplier === '' || product.Supplier_Name === selectedSupplier) &&
      (selectedCategory === '' ||
        product.Installation_Category === selectedCategory)
    );
  });

  return (
    <div className="products-table">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearch}
      />


 {/* 1. products.map((product) => product.Supplier_Name): This part of the code uses the map function to create an array containing all the values of the Supplier_Name property for each product in the products array. This array represents all the unique supplier names.
2. new Set(...): The Set object is then used to create a collection of unique values from the array generated in the previous step. This ensures that each supplier name appears only once in the set.
3. Array.from(...): Converts the unique set of supplier names back into an array. This is done because the map function is more easily applied to arrays.
4. .map((supplier, index) => ...): The resulting array of unique supplier names is then mapped to an array of <option> elements. For each unique supplier name, it creates an <option> element with the value attribute set to the supplier name and the text content inside the <option> also set to the supplier name.
5. key={index}: React requires a unique key attribute for each element in an array to help efficiently update the DOM. In this case, the index is used as the key because the array contains unique values, and the index is sufficient for identifying each element.*/}
      <label>
        Supplier:
        <select value={selectedSupplier} onChange={handleSupplierChange}>
          <option value="">All</option>
          {/* Add options for each unique Supplier_Name in products object */}
          {Array.from(new Set(products.map((product) => product.Supplier_Name))).map(
            (supplier, index) => (
              <option key={index} value={supplier}>
                {supplier}
              </option>
            )
          )}
        </select>
      </label>

      <label>
        Installation Category:
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All</option>
          {/* Add options for each unique Installation_Category in products object */}
          {Array.from(
            new Set(products.map((product) => product.Installation_Category))
          ).map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <table>
      <thead>
           <tr>
             <th>Product Code</th>
             <th>Product Name</th>
             <th>Supplier Name</th>
             <th>UOM</th>
             <th>Rate Ex GST</th>
             <th>Installation Category</th>
           </tr>
         </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id} onClick={() => handleClick(product._id)}>
              <td>{product.Product_Code}</td>
               <td>{product.Product_Name}</td>
               <td>{product.Supplier_Name}</td>
               <td>{product.Product_UOM}</td>
               <td>{product.Rate_Ex_GST}</td>
               <td>{product.Installation_Category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
