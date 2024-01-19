
const NewOrder3 = ({productsOptions}) => {

    if (!productsOptions) {
        // Add loading state or return null/placeholder content if data is not yet available
        return <div>Fetched but No JSON data</div>;
    }

    return ( 
        <div className="dropdown">
            <select>
                {
                productsOptions.map((option) => (
                <option key={option.Product_Code} value={option.Product_Name}>
                    {option.Product_Name}
                </option>
                ))}
            </select>
        </div>
     );
}
 
export default NewOrder3;