import { useHistory } from 'react-router-dom';
import { useState } from 'react'

const Orders = ( {orders} ) => {

  const [searchTerm, setSearchTerm] = useState('');
  const history = useHistory();

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

  const handleClick = (id) => {
      history.push({
          pathname: "/orderdetails",
          state: id
      })
  }

  // Function to determine the background color based on order status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Cancelled':
        return 'gray';
      case 'Confirmation Required':
        return 'red'
      case 'Pending Confirmation':
        return 'coral';
      case 'Delivered to site':
        return 'limegreen';
      case 'Confirmed by Supplier':
        return 'lightblue'
      default:
        return ''; // Default color or no color
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredOrders = orders.filter((order) =>
  Object.values(order).some((value) => {
    const stringValue = String(value).toLowerCase();
    return stringValue.includes(searchTerm.toLowerCase());
  })
);


    return (
      <div>
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <table className='orders-table'>
          <thead>
            <tr>
              <th>Order No</th>
              <th>Project</th>
              <th>Location</th>
              <th>Order Date</th>
              <th>Delivery Date & Time</th>
              <th>Products</th>
              <th>Order Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id} onClick={() => handleClick(order._id)}>
                <td>{order.Order_No}</td>
                <td>{order.Project_ID}</td>
                <td>{order.Location}</td>
                <td>{formatOrderDate(order.Order_date)}</td>
                <td>{`${formatOrderDate(order.Delivery_datetime)} ${formatOrderTime(order.Delivery_datetime)}`}</td>
                <td>
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {order.Products.map(product => (
                      <li key={product.Product_Code} style={{ marginBottom: '8px', fontFamily: 'Arial' }}>
                        <strong style={{ color: 'darkslateblue' }}>{`${product.Product_Code}`}</strong> - 
                        <span style={{ marginLeft: '5px' }}>{`${product.Product_Name}`}</span>
                        <strong style={{ marginLeft: '10px', color: 'lightseagreen' }}>{`QTY: ${product.Qty_per_UOM}`}</strong>
                      </li>
                    ))}
                  </ul>
                </td>
                <td style={{ backgroundColor: getStatusColor(order.Order_status) }}>{order.Order_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      );
}
 
export default Orders;