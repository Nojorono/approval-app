import React from "react";
import ExtraMiniIndicator from "../../ui/miniActivityIndicator/extraMiniIndicator";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";
import Button from "../../ui/button/Button";

interface Track {
  updatedAt: any;
  sentAt: any;
  updateAt: any;
  createdAt: any;
  id: string;
  recipientId: string;
  type: string;
  status: "approved" | "rejected" | string;
  // properti lain sesuai kebutuhan
}

interface Approver {
  id: string;
  username: string;
}

interface NotificationTracksProps {
  notificationTracks: Track[];
  approverIds?: Approver[];
  activeTrackId: string | null;
  isLoading: boolean;
  detail: any;
  onCheckStatus: (trackId: string) => void;
}

const NotificationTracks: React.FC<NotificationTracksProps> = ({
  notificationTracks,
  approverIds = [],
  activeTrackId,
  isLoading,
  detail,
  onCheckStatus,
}) => {
  // Mapping unik berdasarkan recipientId
  const uniqueTracksMap = new Map(
    notificationTracks.map((track) => [track.recipientId, track])
  );

  return (
    <div className="bg-white rounded-xl shadow p-4 my-4 border border-gray-200 sm:p-6">
      {/* Title */}
      <div className="font-semibold mb-4 text-base sm:text-lg text-gray-800">
        Notification Tracks
      </div>

      {/* Wrapper Approvers */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array.from(uniqueTracksMap.entries()).map(([recipientId], idx) => {
          const tracks = notificationTracks.filter(
            (t) => t.recipientId === recipientId
          );
          const approver = approverIds.find((a) => a.id === recipientId);
          const approverLabel = approver ? approver.username : recipientId;

          return (
            <div
              key={idx}
              className="bg-white border rounded-xl shadow-sm p-3 flex flex-col gap-3 hover:shadow-md transition sm:p-4"
            >
              {/* Approver Name */}
              <span
                className="rounded-lg px-3 py-1.5 text-center text-sm font-medium"
                style={{ backgroundColor: "#0d775b", color: "#fff" }}
              >
                {approverLabel}
              </span>

              {/* Tracks List */}
              <div className="flex flex-col gap-3">
                {tracks.map((track, tIdx) => (
                  <div
                    key={tIdx}
                    className="p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 transition flex flex-col gap-2"
                  >
                    {/* === Row Atas: Type + Status + Button === */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {track.type === "whatsapp" && (
                          <FaWhatsapp className="w-4 h-4 text-green-500" />
                        )}
                        {track.type === "email" && (
                          <FaEnvelope className="w-4 h-4 text-blue-500" />
                        )}

                        <span className="font-medium text-sm capitalize text-gray-700">
                          {track.type}
                        </span>

                        <span
                          className={`text-xs sm:text-sm px-2 py-0.5 rounded-full font-medium ${
                            track.status === "sent"
                              ? "bg-green-100 text-green-700"
                              : track.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : track.status === "delivered"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {track.status}
                        </span>
                      </div>

                      {isLoading && activeTrackId === track.id ? (
                        <ExtraMiniIndicator />
                      ) : (
                        <Button
                          type="button"
                          variant="secondary"
                          size="xsm"
                          onClick={() => {
                            onCheckStatus(track.id);
                          }}
                        >
                          Check Status
                        </Button>
                      )}
                    </div>

                    {/* === Row Bawah: Detail Info === */}
                    <div className="flex flex-col gap-1 text-xs text-gray-500">
                      {track.createdAt && (
                        <span>Created: {track.createdAt.toLocaleString()}</span>
                      )}
                      {track.updatedAt && (
                        <span>Updated: {track.updatedAt.toLocaleString()}</span>
                      )}
                      {track.sentAt && (
                        <span>Sent: {track.sentAt.toLocaleString()}</span>
                      )}
                    </div>

                    {/* === Jika Track Aktif (Detail Status + Note) === */}
                    {activeTrackId === track.id && (
                      <div className="text-xs sm:text-sm text-gray-700">
                        {isLoading ? (
                          <span className="text-green-500">loading......</span>
                        ) : detail ? (
                          <div className="flex flex-col gap-1">
                            <span>
                              Current Status:{" "}
                              <b className="capitalize">{detail.status}</b>
                            </span>
                            {detail.note && (
                              <span className="text-gray-600">
                                Catatan: {detail.note}
                              </span>
                            )}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationTracks;
