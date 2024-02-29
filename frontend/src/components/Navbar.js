import { Link } from 'react-router-dom';
const Navbar = () => {
    return ( 
        <nav>
            <h1>QuikQuil System</h1>
            <div className='nav-items'>
                <ul>
                    <li><Link to="/quikquil/">Home</Link></li>
                    <li><Link to="/quikquil/newproduct">New Product</Link></li>
                    <li><Link to="/quikquil/orders">Purchase Orders</Link></li>
                    <li><Link to="/quikquil/neworder">New Order</Link></li>
                </ul>
            </div>
        </nav>
     );
}
 
export default Navbar;