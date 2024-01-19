const Products = ( {products} ) => {


    return ( 
        <div className="products">
            <table>
                <thead>
                    <tr>
                    <th>Product Name</th>
                    <th>Supplier Name</th>
                    <th>UOM</th>
                    <th>Rate Ex GST</th>
                    <th>Installation Category</th>
                    <th>Product Code</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                    <tr key={product.Product_Code}>
                        <td>{product.Product_Name}</td>
                        <td>{product.Supplier_Name}</td>
                        <td>{product.UOM}</td>
                        <td>{product.Rate_Ex_GST}</td>
                        <td>{product.Installation_Category}</td>
                        <td>{product.Product_Code}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
     );
}
 
export default Products;