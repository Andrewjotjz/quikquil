import React, {useState, useEffect} from "react";
import ProductsList from "../pages/ProductsList";
import { useProductsContext } from "../hooks/useProductsContext"

const Home = () => {
  const { products, dispatch } = useProductsContext();
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

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

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="home">
      <h1>All Products</h1>
      {products && <ProductsList products={products} />}
    </div>
  );
};

export default Home;
