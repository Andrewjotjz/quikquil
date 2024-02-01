import { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useOrdersContext } from "../hooks/useOrdersContext"

const OrderDetails = () => {
  
  const history = useHistory();
  const { orders, dispatch3 } = useOrdersContext();
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();

  //Retrieve selectedID from cursor pointer at OrderList.js
  const selectedID = location.state || "";

  // Function to format the date before rendering
  const formatOrderDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Australia/Sydney', // Set the time zone to AEST
  };
  return date.toLocaleString('en-AU', options);
  };

  // Function to format the time before rendering
  const formatOrderTime = (timeString) => {
  const time = new Date(timeString);
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Australia/Sydney', // Set the time zone to AEST
  };
  return time.toLocaleTimeString('en-AU', options);
  };

  useEffect(() => {
      const abortCont = new AbortController();
  
      // setTimeout(() => {
        fetch('/api/orders/'+ selectedID, { signal: abortCont.signal })
        .then(res => {
          if (!res.ok) { // error coming back from server
            throw Error(`could not fetch the data for that resource: "/api/orders/${selectedID}". Please check your database connection.`);
          } 
          return res.json();
        })
        .then(data => {
          setIsPending(false);
          dispatch3({type: 'SET_ORDERS', payload: data})
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

    }, [dispatch3, selectedID])

  const handleUpdate = () => {

    history.push({
      pathname: "/updateorder",
      state: orders
    })
  }

  const handleDelete = () => {
    const shouldDeleteOrder = window.confirm(
      'Are you sure you want to delete this order?'
    );
    //if user clicks OK, clear all selected orders, add first product entry
    if (shouldDeleteOrder) {
      const abortCont = new AbortController();
      fetch('/api/orders/'+ selectedID, { signal: abortCont.signal, method: 'DELETE' })
      .then(res => {
        if (!res.ok) { // error coming back from server
          throw Error(`could not fetch the data for that resource: "/api/orders/${selectedID}". DELETE request failed. Please check your database connection.`);
        } 
        return res.json();
      })
      .then(() => {
        dispatch3({type: 'DELETE_PRODUCT', payload:  { _id: selectedID }})
        setError(null);
        console.log('Data has been deleted:', orders);
        history.push({
          pathname: "/orders"
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
      <div className="order-details">
          {orders && 
          <h2><b>Order No:</b> {orders.Order_No}</h2>
          }
          <label><b>Project ID:</b> {orders.Project_ID}</label>
          <br/>
          <label><b>Location:</b> {orders.Location}</label>
          <br/>
          <label><b>Order Date:</b> {formatOrderDate(orders.Order_date)}</label>
          <br/>
          <label><b>Delivery Date & Time:</b> {formatOrderDate(orders.Delivery_datetime)} {formatOrderTime(orders.Delivery_datetime)}</label>
          <ul><b>Products:</b>
            {orders.Products.map(product => (
                <li key={product.Product_Code}>
                {`${product.Product_Code} - ${product.Product_Name} QTY: ${product.Qty_per_UOM}`}
                </li>
            ))}
          </ul>
          <button onClick={handleUpdate}>Update</button>
          <button onClick={handleDelete}>Delete</button>
      </div>
      );
  }
 
export default OrderDetails;