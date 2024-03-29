import { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useOrdersContext } from "../hooks/useOrdersContext"
import { useOrderHistoryContext } from '../hooks/useOrderHistoryContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderDetails = () => {
  
  const history = useHistory();
  const {orders, dispatch3} = useOrdersContext();
  const {order_history, dispatch4} = useOrderHistoryContext();
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [isShowOrderHistory, setisShowOrderHistory] = useState(false);
  const [isShowComparison, setisShowComparison] = useState(false);
  const [isCompared, setisCompared] = useState(false);
  const [isShowUpdatedOrder, setisShowUpdatedOrder] = useState(true);
  const [isShowStatusButton, setisShowStatusButton] = useState(false);
  const [ProductsDiscrepancyArray, setProductsDiscrepancyArray] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orderStatus, setorderStatus] = useState("");
  const order_status = ["Confirmed by Supplier", "Delivered to site", "Pending Confirmation", "Confirmation Required", "Cancelled"];

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

  useEffect(() => {
    const abortCont = new AbortController();
  
    // setTimeout(() => {
      fetch('/api/order_history/', { signal: abortCont.signal })
      .then(res2 => {
        if (!res2.ok) { // error coming back from server
          throw Error(`could not fetch the data for that resource: "/api/order_history/". Please check your database connection.`);
        } 
        return res2.json();
      })
      .then(data2 => {
        setIsPending(false);
        dispatch4({type: 'SET_ORDER_HISTORY', payload: data2})
        setError(null);
      })
      .catch(err2 => {
        if (err2.name === 'AbortError') {
        } else {
          // auto catches network / connection error
          setIsPending(false);
          setError(err2.message);
        }
      })
    // }, 1000);

    // abort the fetch
    return () => abortCont.abort();
  }, [dispatch4])

  useEffect(() => {
    setisCompared(true);
  }, [ProductsDiscrepancyArray])

  // Function to display order history
  const handleDisplayOrderHistory = () => {
    if (!isShowOrderHistory){
      //Boolean to show order history 
      setisShowOrderHistory(true);
            
      // Logic to find discrepancies
      const historyOrder = order_history.filter(item => item.Order_No === orders.Order_No);
      const discrepancies = [ ...orders.Products.map(historyProduct => {
        const matchingProduct = historyOrder[0].Products.find(updatedProduct => updatedProduct.Product_Code === historyProduct.Product_Code);
        if (!matchingProduct) {
          return { ...historyProduct, discrepancy: 'added' };
        }
        return null;
      }), ...historyOrder[0].Products.map(updatedProduct => {
        const matchingProduct = orders.Products.find(historyProduct => historyProduct.Product_Code === updatedProduct.Product_Code);
        if (!matchingProduct) {
          return { ...updatedProduct, discrepancy: 'removed' };
        } else if (matchingProduct.Qty_per_UOM !== updatedProduct.Qty_per_UOM) {
          return { ...updatedProduct, discrepancy: 'quantity changed', historyQty_per_UOM: matchingProduct.Qty_per_UOM };
        }
        return null;
      })].filter(Boolean);
      setProductsDiscrepancyArray(discrepancies);
    }
    else {
      setisShowOrderHistory(false);
      if (isCompared){
        setisShowUpdatedOrder(false);
      }
      setisShowUpdatedOrder(true);
    }
  }

  // Trigger to show product comparison between current order and order history
  const handleShowComparison = () => {
    if (isCompared) {
      //Logic to display filtered orders (filtered from discrepancy)
      const productsInOrderHistory = ProductsDiscrepancyArray.map(product => product.Product_Code);
      setFilteredOrders(orders.Products.filter(product => !productsInOrderHistory.includes(product.Product_Code)));
      setisShowComparison(true);
      setisShowUpdatedOrder(false);
      document.getElementById('btn-order-history').style.display = 'none';
      document.getElementById('btn-compare-products').style.display = 'none';
    }
  }

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
        history.push({
          pathname: "/orders"
        })
        // Order deleted notification
        toast.success(`Order successfully deleted!`, {
          position: "top-right"
        });
      })
      .catch(err => {
        if (err.name === 'AbortError') {
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

  const handleStatusChange = (e) => {
    setorderStatus(e.target.value)
    setisShowStatusButton(true);
  }

  const handleSaveStatus = () => {
    setisShowComparison(false);
    setisShowOrderHistory(false);
    //create Order object
    const newStatus = {
      Order_status: orderStatus
      };

    const abortCont = new AbortController();

    // Logic to save order status to the database or POST existing Order object to database
    fetch('/api/orders/' + selectedID, { 
      signal: abortCont.signal, method: 'PATCH',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStatus) 
  })
  .then(res => {
      if (!res.ok) { // error coming back from server
        throw Error(`could not fetch the data for that resource: "/api/products/${selectedID}". PATCH request failed. Please check your database connection.`);
      } 
      return res.json();
    })
    .then(() => {
      dispatch3({type: 'UPDATE_ORDER', payload: newStatus})
      setError(null);
      return
    })
    .catch(err => {
      if (err.name === 'AbortError') {
      } else {
        // auto catches network / connection error
        setError(err.message);
      }
    })
    window.location.reload();
  }

  const handleCancelEditStatus = () => {
    setorderStatus(orders.Order_status)
    setisShowStatusButton(false);
  }

  if (isPending) {
      return <div>Loading...</div>;
  }

  if (error) {
      return <div>Error: {error}</div>;
  }

  return ( 
      <div className="order-details-page">
        <h1><b>Order No:</b>{orders.Order_No}</h1>
        <div className="order-details" style={{display:"inline-block"}}>
          <label><b>Project ID:</b> {orders.Project_ID}</label>
          <br/>
          <label><b>Location:</b> {orders.Location}</label>
          <br/>
          <label><b>Order Date:</b> {formatOrderDate(orders.Order_date)}</label>
          <br/>
          <label><b>Delivery Date & Time:</b> {formatOrderDate(orders.Delivery_datetime)} {formatOrderTime(orders.Delivery_datetime)}</label>
          <br/>
          <label>
            <b>Order Status:</b> 
            <select value={orderStatus} onChange={(e) => handleStatusChange(e)}>
              <option value={orders.Order_status}>{orders.Order_status}</option>
              { order_status && order_status.filter(item => item !== orders.Order_status).map( (status,index) => (
              <option key={index} value={status}>{status}</option>
              ))}
            </select>
          </label>
          { isShowStatusButton &&
          <div className="status-button" style={{display: "inline-block"}}>
            <button id="btn-save-status" onClick={handleSaveStatus}>Save</button>
            <button id="btn-cancel-edit-status" onClick={handleCancelEditStatus} >Cancel</button>
          </div>
          }
          <br/>
          <label><b>Products:</b></label>
            { isShowUpdatedOrder &&
            <ul>
              {orders.Products && orders.Products.map(product => (
                  <li key={product.Product_Code}>
                      {`${product.Product_Code} - ${product.Product_Name} - Qty: ${product.Qty_per_UOM}`}
                  </li>
              ))}
            </ul>
            }

            { isShowComparison &&
            <ul>
            {filteredOrders && filteredOrders.map(product => (
              <li key={product.Product_Code}>
                  {`${product.Product_Code} - ${product.Product_Name} - Qty: ${product.Qty_per_UOM}`}
              </li>
            ))}
            {ProductsDiscrepancyArray && ProductsDiscrepancyArray.map(product => (
              <li key={product.Product_Code} style={{ color: product.discrepancy === 'added' || product.discrepancy === 'quantity changed' ? "mediumseagreen" : "indianred" }}>
                {product.discrepancy !== 'quantity changed' && `${product.Product_Code} - ${product.Product_Name} - Qty: ${product.Qty_per_UOM} (${product.discrepancy})`}
                {product.discrepancy === 'quantity changed' && `${product.Product_Code} - ${product.Product_Name} - Qty: ${product.historyQty_per_UOM} (${product.discrepancy}, previous Qty: ${product.Qty_per_UOM})`}
              </li>
            ))}
            <li>
              <label><b>Update reason: </b>{order_history && order_history.filter(item => item.Order_No === orders.Order_No)[0].Order_update_reason}</label>
            </li>
            <li>
              <label><b>Update comment: </b>{order_history && order_history.filter(item => item.Order_No === orders.Order_No)[0].Order_update_comment}</label>
            </li>
            </ul>
            }
            {isShowOrderHistory && <button id="btn-compare-products" onClick={handleShowComparison}>See order changes</button>}
            <br/>
            <label><b>Last Revised:</b></label>
            {orders && 
            orders.createdAt === orders.updatedAt ? (
              <label>None</label>
              ) : (
              <div style={{display:"inline-block"}}>
                <label>{formatOrderDate(orders.updatedAt)} {formatOrderTime(orders.updatedAt)}</label>
                <button id="btn-order-history" onClick={handleDisplayOrderHistory}>Order History</button>
              </div>)
            }
            <button onClick={handleUpdate}>Edit order</button>
            <button onClick={handleDelete}>Delete order</button>
          </div>

          { isShowOrderHistory &&
          <div className="order-history-details" style={{color: "dimgray" }}>
            <h2 style={{borderTop:"2px solid grey" }}>Order History</h2>
            {order_history && order_history.filter(item => item.Order_No === orders.Order_No).map( (historyItem, index) => (
              <div key={historyItem._id} style={{borderBottom:"1px solid grey"}}>
                <h3><b>Version {order_history.filter(item => item.Order_No === orders.Order_No).length - index}</b></h3>
                <label><b>Project ID:</b> {historyItem.Project_ID}</label>
                <br/>
                <label><b>Location:</b> {historyItem.Location}</label>
                <br/>
                <label><b>Order Date:</b> {formatOrderDate(historyItem.Order_date)}</label>
                <br/>
                <label><b>Delivery Date & Time:</b> {formatOrderDate(historyItem.Delivery_datetime)} {formatOrderTime(historyItem.Delivery_datetime)}</label>
                {historyItem && historyItem.Products ? (
                  <ul>
                      <b>Products:</b>
                      {historyItem.Products.map(product => (
                          <li key={product.Product_Code}>
                              {`${product.Product_Code} - ${product.Product_Name} - Qty: ${product.Qty_per_UOM}`}
                          </li>
                      ))}
                  </ul>
                ) : (
                  <p>No products available for this order.</p>
                )}
              </div>
            ))}
          </div>
          }
      </div>
      );
  }
 
export default OrderDetails;