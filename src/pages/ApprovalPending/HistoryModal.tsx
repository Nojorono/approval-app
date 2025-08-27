import { ApprovalProcessResponse } from "../../DynamicAPI/types/ApprovalProcessTypes";

interface Props {
  data: ApprovalProcessResponse | null;
  onClose: () => void;
}

const HistoryModal: React.FC<Props> = ({ data, onClose }) => {
  if (!data) return null;

  const { approvalRequest } = data;

  return (
    <div className="fixed inset-0 z-5000 flex items-center justify-center">
      {/* Blur background */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 bg-white rounded-lg border border-gray-200 shadow p-8">
        <h2 className="text-2xl font-semibold mb-5">Request Details</h2>
        <div className="space-y-3 text-lg">
            {[
            { label: "ID", value: approvalRequest.code },
            { label: "Requestor", value: approvalRequest.creator?.username ?? '-' },
            { label: "Subject", value: approvalRequest.subject },
            { label: "Description", value: approvalRequest.description },
            { label: "Last Updated", value: approvalRequest.updatedAt },
            ].map((item, idx) => (
            <div key={idx} className="flex justify-between">
              <span className="font-bold">{item.label}:</span>
              <span className="ml-4">{item.value}</span>
            </div>
            ))}
            <div className="flex justify-between">
            <span className="font-bold">Status:</span>
            <span
              className={`ml-4 ${
              data.status === "approved"
                ? "text-green-600 font-bold"
                : data.status === "rejected"
                ? "text-red-600 font-bold"
                : ""
              }`}
            >
              {data.status}
            </span>
            </div>
            <div>
            <span className="font-bold">Attachments:</span>
            <ul className="ml-6 list-disc">
              {approvalRequest.attachments.length > 0
              ? approvalRequest.attachments.map((file, idx) => (
                <li key={idx}>
                <a
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {file}
                </a>
                </li>
              ))
              : <li>-</li>
              }
            </ul>
            </div>
          {data.status === 'Rejected' && (
            <div><span className="font-bold">Reason Rejected:</span> {data.reasonRejected}</div>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-8 w-full text-xl bg-gray-900 hover:bg-gray-700 text-white py-3 rounded transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default HistoryModal;