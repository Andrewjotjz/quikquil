import { BrowserRouter, Route, Switch } from "react-router-dom/cjs/react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import UpdateProduct from "./components/UpdateProduct";
import NewProduct from "./components/NewProduct";
import NewOrder from "./components/NewOrder";
import PurchaseOrder from "./components/PurchaseOrder";
import ProductDetails from "./pages/ProductDetails";
import OrderDetails from "./pages/OrderDetails";
import UpdateOrder from "./components/UpdateOrder";



function App() {

  return (
          <BrowserRouter>
            <div className="App">
              <Navbar/>
              <div className="content">
                <Switch>
                  <Route exact path="/quikquil/">
                    <Home/>
                  </Route>
                  <Route exact path="/quikquil/updateproduct">
                    <UpdateProduct/>
                  </Route>
                  <Route exact path="/quikquil/productdetails">
                    <ProductDetails/>
                  </Route>
                  <Route exact path="/quikquil/newproduct">
                    <NewProduct/>
                  </Route>
                  <Route exact path="/quikquil/orders">
                    <PurchaseOrder/>
                  </Route>
                  <Route exact path="/quikquil/orderdetails">
                    <OrderDetails/>
                  </Route>
                  <Route exact path="/quikquil/updateorder">
                    <UpdateOrder/>
                  </Route>
                  <Route exact path="/quikquil/neworder">
                    <NewOrder/>
                  </Route>
                </Switch>
              </div>
            </div>
          </BrowserRouter>
  );
}

export default App;
