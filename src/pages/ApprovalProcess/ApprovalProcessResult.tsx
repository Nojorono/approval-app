import React from 'react';
import { useLocation } from 'react-router-dom';
export default function ApprovalStatus(){
    const location = useLocation();
    const data = location.state;


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
        {/* Header Section */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-700">Approval Status</h2>
        </div>

        {/* Status Section */}
        <div className={`p-4 rounded-lg mb-6 ${data?.status === false ? 'bg-red-50' : 'bg-green-50'}`}>
          <span className={`text-xl font-semibold ${data?.status === false ? 'text-red-500' : 'text-green-500'}`}>
            {data?.status === false ? 'Request Reject!' : 'Request Approved!'}
          </span>
          <p className="text-gray-600">
            {data?.status === false
              ? 'Request has been rejected'
              : 'Request has been successfully approved'}
          </p>
        </div>

        {/* Details Section */}
        <div className="space-y-4 text-left">
          <div>
            <strong className="text-gray-700">Approval Request Number</strong>
            <p className="text-gray-600">APR-0001</p>
          </div>
          <div>
            <strong className="text-gray-700">Approval Subject</strong>
            <p className="text-gray-600">Pengadaan Device</p>
          </div>
          <div>
            <strong className="text-gray-700">Approver Username</strong>
            <p className="text-gray-600">AYU</p>
          </div>
          <div>
            <strong className="text-gray-700">Date & Time</strong>
            <p className="text-gray-600">19 Agustus 2025, 09:30 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};


