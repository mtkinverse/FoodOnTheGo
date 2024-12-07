import React, { useEffect, useState } from "react";
import { useUserContext } from "../contexts/userContext";
import { ChevronRight } from "lucide-react";
import axios from "axios";
import { useAlertContext } from "../contexts/alertContext";
import { usePopUpContext } from "../contexts/popUpContext";


const ComplaintLodger = () => {

    const {complaint,setComplaint, lodger, setLodger} = usePopUpContext();
    const {pastOrders, fetchOrders, userData } = useUserContext();
    const { setAlert } = useAlertContext();

    useEffect(() => {
        if (pastOrders.length === 0) fetchOrders();
        console.log('received ',complaint, order_id, restaurant_id)
    }, [complaint])

    const handleSubmit = e => {
        e.preventDefault();
        const req = { Customer_id: userData.User_id, Order_id: complaint.Order_id, Complaint_Desc: complaint.desc }
        console.log('seding req', req);

        axios.post('/api/lodgeComplaint', JSON.stringify(req), {
            withCredentials: true, headers: { "Content-Type": "application/json" }
        })
            .then(res => {
                setAlert({ message: 'Complaint Lodged', type: 'success' });
                setLodger(false);
            })
            .catch(err => {
                setAlert({ message: err.message, type: 'failure' });
            }
            )
    }

    return (
        <div className={`inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 fixed`}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 className="text-2xl font-bold text-purple-600 mb-4">
                    Lodge Complaint
                </h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="complaintOrder" className="block text-sm font-medium text-gray-700 mb-1">
                            Select The Order
                        </label>
                        <div className="relative">
                            <select
                                id="complaintOrder"
                                name="complaintOrder"
                                value={complaint.Order_id}
                                onChange={e => setComplaint(prev => ({ ...prev, Order_id: e.target.value }))}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm max-h-full"
                                required
                            >
                                <option value='0'>Select Order</option>
                                {pastOrders.length && complaint.restaurant_id &&
                                    pastOrders.filter(ele => ele.restaurant_id === complaint.restaurant_id).map(ele => (
                                        <option key={ele.order_id} value={ele.order_id}>{ele.order_id} From {ele.restaurant_name}</option>
                                    ))
                                }
                                {/* {console.log('complaint is ', complaint, pastOrders, pastOrders.filter(ele => ele.restaurant_id === complaint.restaurant_id))} */}
                                {pastOrders.length && !complaint.restaurant_id &&
                                    pastOrders.map(ele => (
                                        <option key={ele.order} value={ele.order_id}>{ele.order_id} From {ele.restaurant_name}</option>
                                    ))
                                }
                            </select>
                            <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400" size={16} />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="address"
                            className="block text-gray-700 font-bold mb-2"
                        >
                            Description {`(${complaint.desc.length}/200)`}
                        </label>
                        <textarea
                            type="text"
                            id="desc"
                            name="Address"
                            placeholder="Describe your complaint within 200 words"
                            className={`w-full rounded-lg py-2 px-3 text-gray-700 ${complaint.desc.length >= 200 ? 'border-red-600' : 'border-black'}`}
                            value={complaint.desc}
                            onChange={e => {
                                if (e.target.value.length < 200) setComplaint(prev => ({ ...prev, desc: e.target.value }))
                            }
                            }
                            required
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <button
                            type="button"
                            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 w-full sm:w-auto"
                            onClick={() => {
                                setComplaint({ desc: '', Order_id: undefined, restaurant_id: undefined })
                                setLodger(false);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 w-full sm:w-auto"
                        >
                            Confirm
                        </button>
                    </div>

                </form>
            </div>
        </div>

    );
}

export default ComplaintLodger;