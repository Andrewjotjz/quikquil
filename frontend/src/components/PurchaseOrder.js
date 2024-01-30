import OrdersList from "../pages/OrdersList";
import React, {useState, useEffect} from "react";
import { useOrdersContext } from "../hooks/useOrdersContext"

const PurchaseOrder = () => {
  const { orders, dispatch3 } = useOrdersContext();
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortCont = new AbortController();

    // setTimeout(() => {
      fetch('/api/orders', { signal: abortCont.signal })
      .then(res => {
        if (!res.ok) { // error coming back from server
          throw Error('could not fetch the data for that resource: "/api/orders". Please check your database connection.');
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
  }, [dispatch3])

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return ( 
    <div className="purchase-order">
        <h1>Purchase Orders</h1>
        { orders && <OrdersList orders={orders}/>}
    </div>
  );
}
 
export default PurchaseOrder;