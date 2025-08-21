import React from "react";

interface TimelineItem {
  time: string;
  label: string;
  desc: string;
}

interface ApprovalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  approverName: string;
  requestId: string;
  emailStatus: string;
  waStatus: string;
  timeline: TimelineItem[];
}

const ModalApproval: React.FC<ApprovalDetailModalProps> = ({
  isOpen,
  onClose,
  approverName,
  requestId,
  emailStatus,
  waStatus,
  timeline,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 px-2">
      <div className="bg-green-50 rounded-2xl p-4 sm:p-8 w-full max-w-md relative">
      <button
        className="absolute top-3 right-3 sm:top-4 sm:right-4 text-2xl"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>
      <div className="flex items-center mb-4 sm:mb-6">
        <span className="text-2xl sm:text-3xl mr-2">👤</span>
        <h2 className="text-xl sm:text-2xl font-bold">{approverName}</h2>
      </div>
      <div className="mb-3 sm:mb-4">
        <label className="block text-gray-700 font-medium mb-1">
        Request ID
        </label>
        <input
        className="w-full bg-gray-200 rounded px-3 py-2 text-sm"
        value={requestId}
        readOnly
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-700 font-medium mb-1">Email</label>
        <div className="bg-green-100 rounded px-3 py-2 text-green-700 text-sm">
        {emailStatus}
        </div>
      </div>
      <div className="mb-3 sm:mb-4">
        <label className="block text-gray-700 font-medium mb-1">
        WhatsApp
        </label>
        <div className="bg-green-100 rounded px-3 py-2 text-green-700 text-sm">
        {waStatus}
        </div>
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-2">
        Timeline
        </label>
        <ul className="space-y-3 sm:space-y-4">
        {timeline.map((item, idx) => (
          <li key={idx} className="flex items-start">
          <span className="mt-1 mr-2 sm:mr-3 text-gray-500 text-xs sm:text-base">●</span>
          <div>
            <div className="text-xs sm:text-sm text-gray-800">{item.time}</div>
            <div className="text-xs sm:text-sm">
            <span className="font-bold">{item.label}</span>{" "}
            {item.desc && <span>{item.desc}</span>}
            </div>
          </div>
          </li>
        ))}
        </ul>
      </div>
      </div>
    </div>
  );
};

export default ModalApproval;
