import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  ExpandedState,
} from "@tanstack/react-table";

import PaginationControls from "./Pagination";
import Button from "../../ui/button/Button";
import ModalApproval from "../../modal/type/ModalApproval";

interface TableComponentProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  globalFilter?: string;
  setGlobalFilter?: (value: string) => void;
  onDetail?: (id?: any) => void;
  enableSelection?: boolean;
  pageSize?: number;
}

const TableComponent = <
  T extends {
    notificationTracks: never[];
    id?: any;
    approverIds?: { id: string; username: string }[];
  }
>({
  data,
  columns,
  globalFilter,
  setGlobalFilter,
  enableSelection = true,
  pageSize,
}: TableComponentProps<T>) => {
  const [pagination, setPagination] = useState(() => ({
    pageIndex: 0,
    pageSize: pageSize ?? 20,
  }));

  // State untuk track row yang di-expand
  const [expandedRowIds, setExpandedRowIds] = useState<ExpandedState>({});

  const table = useReactTable<T>({
    data,
    columns,
    state: {
      globalFilter,
      pagination,
      columnVisibility: {
        select: enableSelection,
      },
      expanded: expandedRowIds,
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onExpandedChange: setExpandedRowIds,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: enableSelection,
    enableExpanding: true,
  });

  // State for modal open/close
  const [isModalOpen, setModalOpen] = useState(false);

  // Contoh data
  const timeline = [
    {
      time: "18/08/2025, 8:30 AM",
      label: "opened",
      desc: "by Approver 1",
    },
    {
      time: "18/08/2025, 8:20 AM",
      label: "notified",
      desc: "by system - email/WA sent",
    },
    {
      time: "18/08/2025, 8:18 AM",
      label: "created",
      desc: "by Rani Requestor",
    },
  ];

  const handleModalDetail = (row: T) => {
    console.log("row", row);

    setModalOpen(true);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="sticky top-0 bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="text-left">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 border-b cursor-pointer"
                      style={{ textAlign: "left" }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getIsSorted() === "asc" && " 🔼"}
                      {header.column.getIsSorted() === "desc" && " 🔽"}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <tr
                    className="hover:bg-gray-50 cursor-pointer"
                    style={{ textAlign: "left" }}
                    onClick={() => row.toggleExpanded()}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-2 py-2 border-b text-xs sm:px-4 sm:text-sm"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>

                  {row.getIsExpanded() && (
                    <tr>
                      <td colSpan={row.getVisibleCells().length}>
                        {row.original.notificationTracks &&
                          row.original.notificationTracks.length > 0 && (
                            <div className="bg-white rounded shadow p-2 my-2 border border-gray-200 sm:p-4">
                              <div className="font-semibold mb-2 text-sm sm:text-base">
                                Notification Tracks
                              </div>
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 sm:gap-4">
                                {Array.from(
                                  new Map(
                                    (row.original.notificationTracks ?? []).map(
                                      (track: any) => [track.recipientId, track]
                                    )
                                  ).entries()
                                ).map(
                                  (
                                    [recipientId, firstTrack]: [string, any],
                                    idx: number
                                  ) => {
                                    // Ambil semua track dengan recipientId yang sama
                                    const tracks = (
                                      row.original.notificationTracks ?? []
                                    ).filter(
                                      (t: any) => t.recipientId === recipientId
                                    );
                                    const approver = (
                                      Array.isArray(row.original.approverIds)
                                        ? row.original.approverIds
                                        : []
                                    ).find(
                                      (approver: any) =>
                                        approver.id === recipientId
                                    );
                                    const approverLabel = approver
                                      ? `${approver.username}`
                                      : recipientId;

                                    function stringToColor(str: string) {
                                      let hash = 0;
                                      for (let i = 0; i < str.length; i++) {
                                        hash =
                                          str.charCodeAt(i) +
                                          ((hash << 5) - hash);
                                      }
                                      const c = (hash & 0x00ffffff)
                                        .toString(16)
                                        .toUpperCase();
                                      return (
                                        "#" +
                                        "00000".substring(0, 6 - c.length) +
                                        c
                                      );
                                    }
                                    const color = stringToColor(recipientId);

                                    return (
                                      <div
                                        key={idx}
                                        className="bg-white border rounded shadow p-2 flex flex-col gap-2 sm:p-4"
                                      >
                                        <span
                                          style={{
                                            backgroundColor: color,
                                            color: "#fff",
                                            borderRadius: "4px",
                                            padding: "2px 8px",
                                            display: "inline-block",
                                            minWidth: "60px",
                                            textAlign: "center",
                                            fontSize: "0.85rem",
                                          }}
                                        >
                                          {approverLabel}
                                        </span>
                                        <div className="flex flex-col gap-1">
                                          {tracks.map(
                                            (track: any, tIdx: number) => (
                                              <div
                                                key={tIdx}
                                                className="flex items-center gap-2"
                                              >
                                                <span className="text-gray-700 min-w-[60px] text-xs sm:text-sm">
                                                  {track.type}
                                                </span>
                                                <span className="text-gray-500 text-xs sm:text-sm">
                                                  {track.status}
                                                </span>
                                              </div>
                                            )
                                          )}
                                        </div>
                                    
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ModalApproval
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        approverName="Approver 1"
        requestId="R-002"
        emailStatus="Sent"
        waStatus="Sent"
        timeline={timeline}
      />
      <PaginationControls
        pageIndex={table.getState().pagination.pageIndex}
        pageSize={table.getState().pagination.pageSize}
        pageCount={table.getPageCount()}
        setPageSize={(size) =>
          setPagination((prev) => ({ ...prev, pageSize: size }))
        }
        previousPage={table.previousPage}
        nextPage={table.nextPage}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        selectedRowCount={table.getSelectedRowModel().rows.length}
        totalDataCount={data.length}
        gotoPage={(page: number) =>
          setPagination((prev) => ({ ...prev, pageIndex: page }))
        }
      />
    </>
  );
};

export default TableComponent;
