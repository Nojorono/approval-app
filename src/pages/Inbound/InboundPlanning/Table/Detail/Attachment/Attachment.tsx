import React, { useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useStoreInboundAttachment } from "../../../../../../DynamicAPI/stores/Store/MasterStore";
import TableComponent from "../../../../../../components/tables/MasterDataTable/TableComponent";
import ActIndicator from "../../../../../../components/ui/activityIndicator";

const Attachment = (data: any) => {
  const IdInbound = data.data.id;
  const { fetchById, detail } = useStoreInboundAttachment();

  useEffect(() => {
    const fetchData = async () => {
      await fetchById(IdInbound);
    };

    fetchData();
  }, [IdInbound]);

  const mappedAttachment = useMemo(() => {
    if (!detail || !Array.isArray(detail)) return [];
    return detail.map((item: any) => ({
      id: item.id ?? "",
      inbound_plan_id: item.inbound_plan_id ?? "",
      organization_id: item.organization_id ?? "",
      name: item.name ?? "",
      path: item.path ?? "",
      s3_bucket: item.s3_bucket ?? "",
      s3_key: item.s3_key ?? "",
      s3_url: item.s3_url ?? "",
      file_size: item.file_size ?? "",
      content_type: item.content_type ?? "",
      etag: item.etag ?? "",
      is_public: item.is_public ?? false,
      createdAt: item.createdAt
        ? new Date(item.createdAt).toLocaleString()
        : "",
      updatedAt: item.updatedAt
        ? new Date(item.updatedAt).toLocaleString()
        : "",
    }));
  }, [detail]);

  const [popupImg, setPopupImg] = useState<string | null>(null);

  const handleImgClick = (url: string) => {
    setPopupImg(url);
  };

  const handleClosePopup = () => {
    setPopupImg(null);
  };

  const TableColumns: ColumnDef<any>[] = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Inbound Plan ID",
      accessorKey: "inbound_plan_id",
    },
    {
      header: "Foto",
      accessorKey: "s3_url",
      cell: ({ row }) =>
        row.original.s3_url ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <img
              src={row.original.s3_url}
              alt={row.original.name || "attachment"}
              style={{
                maxWidth: 100,
                maxHeight: 100,
                marginTop: 4,
                cursor: "pointer",
              }}
              onClick={() => handleImgClick(row.original.s3_url)}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        ) : (
          "-"
        ),
    },
    // {
    //   header: "Content Type",
    //   accessorKey: "content_type",
    // },
    // {
    //   header: "Created At",
    //   accessorKey: "createdAt",
    // },
    // {
    //   header: "Updated At",
    //   accessorKey: "updatedAt",
    // },
  ];

  return (
    <>
      <TableComponent
        data={mappedAttachment}
        columns={TableColumns}
        pageSize={5}
      />

      {popupImg && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
          onClick={handleClosePopup}
        >
          <div
            className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-4 max-w-3xl max-h-[800px] flex items-center justify-center relative shadow-lg border border-white border-opacity-30"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <button
              className="absolute top-2 right-2 text-gray-200 hover:text-red-500 text-2xl font-bold"
              onClick={handleClosePopup}
              aria-label="Close"
              type="button"
            >
              &times;
            </button>
            <img
              src={popupImg}
              alt="Attachment"
              className="max-w-full max-h-[700px] rounded"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Attachment;
