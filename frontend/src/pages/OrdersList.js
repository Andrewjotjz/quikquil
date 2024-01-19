import { useHistory } from 'react-router-dom';

const Orders = ( {orders} ) => {

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

  const history = useHistory();

  const handleClick = (id) => {
      history.push({
          pathname: "/orderdetails",
          state: id
      })
  }


    return (
        <table>
          <thead>
            <tr>
              <th>Order No</th>
              <th>Project</th>
              <th>Location</th>
              <th>Order Date</th>
              <th>Delivery Date & Time</th>
              <th>Products</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} onClick={() => handleClick(order._id)}>
                <td>{order.Order_No}</td>
                <td>{order.Project_ID}</td>
                <td>{order.Location}</td>
                <td>{formatOrderDate(order.Order_date)}</td>
                <td>{`${formatOrderDate(order.Delivery_datetime)} ${formatOrderTime(order.Delivery_datetime)}`}</td>
                <td>
                  <ul>
                    {order.Products.map(product => (
                      <li key={product.Product_Code}>
                        {`${product.Product_Code} - ${product.Product_Name} (${product.Supplier_Name}) QTY: ${product.Qty_per_UOM}`}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
}
 
export default Orders;