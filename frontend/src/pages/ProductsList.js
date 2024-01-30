import { useHistory } from 'react-router-dom';

const Products = ( {products} ) => {

    const history = useHistory();

    const handleClick = (id) => {
        history.push({
            pathname: "/productdetails",
            state: id
        })
    }


    return ( 
        <div className="products-table">
            <table>
                <thead>
                    <tr>
                    <th>Product Code</th>
                    <th>Product Name</th>
                    <th>Supplier Name</th>
                    <th>UOM</th>
                    <th>Rate Ex GST</th>
                    <th>Installation Category</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                    <tr key={product._id} onClick={() => handleClick(product._id)}>
                        <td>{product.Product_Code}</td>
                        <td>{product.Product_Name}</td>
                        <td>{product.Supplier_Name}</td>
                        <td>{product.Product_UOM}</td>
                        <td>{product.Rate_Ex_GST}</td>
                        <td>{product.Installation_Category}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
     );
}
 
export default Products;