import { Link } from 'react-router-dom';
const Navbar = () => {
    return ( 
        <nav>
            <h1>QuikQuill System</h1>
            <div>
                <Link to="/">Home</Link>
                <Link to="/newproduct">New Product</Link>
                <Link to="/orders">Purchase Orders</Link>
                <Link to="/neworder">New Order</Link>
            </div>
        </nav>
     );
}
 
export default Navbar;