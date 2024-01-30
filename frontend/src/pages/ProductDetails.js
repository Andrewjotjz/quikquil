import { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useProductsContext } from "../hooks/useProductsContext"

const ProductDetails = () => {
  
  const history = useHistory();
  const { products, dispatch } = useProductsContext();
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();

  //Retrieve data
  const data = location.state || "";

  useEffect(() => {
      const abortCont = new AbortController();
  
      // setTimeout(() => {
        fetch('/api/products/'+ data, { signal: abortCont.signal })
        .then(res => {
          if (!res.ok) { // error coming back from server
            throw Error(`could not fetch the data for that resource: "/api/products/${data}". Please check your database connection.`);
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

    }, [dispatch, data])

  const handleUpdate = () => {
    history.push({
      pathname: "/updateproduct",
      state: products
  })

  }

  const handleDelete = () => {
    const shouldDeleteProduct = window.confirm(
      'Are you sure you want to delete this product?'
    );
    //if user clicks OK, clear all selected products, add first product entry
    if (shouldDeleteProduct) {
      const abortCont = new AbortController();
      fetch('/api/products/'+ data, { signal: abortCont.signal, method: 'DELETE' })
      .then(res => {
        if (!res.ok) { // error coming back from server
          throw Error(`could not fetch the data for that resource: "/api/products/${data}". DELETE request failed. Please check your database connection.`);
        } 
        return res.json();
      })
      .then(() => {
        dispatch({type: 'DELETE_PRODUCT', payload:  { _id: data }})
        setError(null);
        console.log('Data has been deleted:', products);
        history.push({
          pathname: "/"
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
    else{
      return
    }
  }

  if (isPending) {
      return <div>Loading...</div>;
  }

  if (error) {
      return <div>Error: {error}</div>;
  }

  return ( 
      <div className="product-details">
        <h1>Product Details</h1>
        {products && 
        <h2>Product: {products.Product_Name}</h2>}
        <label><b>Product Code:</b> {products.Product_Code}</label>
        <br/>
        <label><b>Supplier Name:</b> {products.Supplier_Name}</label>
        <br/>
        <label><b>UOM:</b> {products.Product_UOM}</label>
        <br/>
        <label><b>Rate Ex GST:</b> {products.Rate_Ex_GST}</label>
        <br/>
        <label><b>Installation Category:</b> {products.Installation_Category}</label>
        <br/>
        <button onClick={handleUpdate}>Update</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
      );
  }
 
export default ProductDetails;