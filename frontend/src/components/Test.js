import { useState } from 'react';

const UpdateReasonForm = ({ isOpen, onClose, onSubmitReasonForm }) => {

    const [reason, setReason] = useState("");
    const [comment, setComment] = useState("");

    // //'Cancel' button, remove latest entry of order history and return to previous page
    // const handleCancel = () => {
    //     const shouldDeleteOrderHistory = window.confirm(
    //     'Do you want to discard changes?'
    //     );
    //     //if user clicks OK, clear all selected orders, add first product entry
    //     if (shouldDeleteOrderHistory) {
    //     const abortCont = new AbortController();
    //     fetch('/api/order_history/'+ data._id, { signal: abortCont.signal, method: 'DELETE' })
    //     .then(res => {
    //         console.log("data ID is: ", data._id)
    //         if (!res.ok) { // error coming back from server
    //         throw Error(`could not fetch the data for that resource: "/api/order_history/${data._id}". DELETE request failed. Please check your database connection.`);
    //         } 
    //         return res.json();
    //     })
    //     .then(() => {
    //         dispatch4({type: 'DELETE_ORDER_HISTORY', payload:  { _id: data }})
    //         setError(null);
    //         console.log('Data has been deleted:', data);
    //         history.goBack();
    //     })
    //     .catch(err => {
    //         if (err.name === 'AbortError') {
    //         console.log('fetch aborted')
    //         } else {
    //         // auto catches network / connection error
    //         setError(err.message);
    //         }
    //     })
        
    //     setFormModified(false);
    //     }
    //     else{
    //     return
    //     }
    // }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Call the onSubmitReasonForm function and pass the reason and comment
        onSubmitReasonForm(reason, comment);

        // Close the modal
        onClose();
    }


    return (

            <div style={{ display: isOpen ? 'block' : 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: '20px' }}>
                    <h2>Order Update - Reason & Comment</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                        Update reason:
                        <input required type="text" value={reason} onChange={(e) => setReason(e.target.value)} />
                    </label>
                    </div>

                    <div>
                        <label>
                        Additional comment:
                        <input required type="text" value={comment} onChange={(e) => setComment(e.target.value)} />
                    </label>
                    </div>
            
                    <br />
                    <button type='submit'>Submit</button>    
                </form>
                <button onClick={onClose}>Cancel</button>
                </div>
        </div>
    );
  };
  
  export default UpdateReasonForm;
  