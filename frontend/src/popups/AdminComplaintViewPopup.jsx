import React, { useEffect, useState } from "react";
import { useUserContext } from "../contexts/userContext";
import { ChevronRight } from "lucide-react";
import axios from "axios";
import { useAlertContext } from "../contexts/alertContext";
import { usePopUpContext } from "../contexts/popUpContext";


const AdminComplaintViewPopup = () => {

    const {adminComplaintPopup,setAdminComplaintPopup} = usePopUpContext();
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState({ Complaint_id: undefined, Customer_id: undefined, Restaurant_id: undefined, Order_id: undefined, Complaint_desc: '', Status: undefined })

    const handleSubmit = e => {
        e.preventDefault();
        setAdminComplaintPopup(false);
    }

    useEffect(() => {
        ///fetch the complaints my boy
    },[])

    return (
        <div className={`inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 fixed`}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 className="text-2xl font-bold text-purple-600 mb-4">
                    View Complaints
                </h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="complaintOrder" className="block text-sm font-medium text-gray-700 mb-1">
                            Select The Complaint
                        </label>
                        <div className="relative">
                            <select
                                id="complaintSelection"
                                name="complaint"
                                value={selectedComplaint}
                                onChange={e => setSelectedComplaint(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm max-h-full"
                                required
                            >
                                <option value='0'>Select Complaint</option>
                                {complaints.length &&
                                    complaints.map(ele => (
                                        <option key={ele.Complaint_id} value={ele.Complaint_id}>{ele.order_id} - {ele.Status}</option>
                                    ))
                                }
                            </select>
                            <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400" size={16} />
                        </div>
                    </div>

                    {selectedComplaint.Complaint_id &&
                        <div>
                            <label htmlFor="displayComplaint" className="block text-sm font-medium text-gray-700 mb-1">
                                Complaint {selectedComplaint.Complaint_id}
                            </label>
                            <div className="relative">
                                
                            </div>
                        </div>
                    }

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

export default AdminComplaintViewPopup;