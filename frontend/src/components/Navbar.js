import { Link } from 'react-router-dom';
const Navbar = () => {
    return ( 
        <nav>
            <h1>QuikQuil System</h1>
            <div className='nav-items'>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/newproduct">New Product</Link></li>
                    <li><Link to="/orders">Purchase Orders</Link></li>
                    <li><Link to="/neworder">New Order</Link></li>
                    <li><Link to="/test">Test</Link></li>
                </ul>
            </div>
        </nav>
     );
}
 
export default Navbar;