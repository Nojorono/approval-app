import React, { useEffect, useState } from "react";
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
import {
  useStoreApprovalNotification,
  useStoreApprovalRequestWithRelations,
} from "../../../DynamicAPI/stores/Store/MasterStore";

import PaginationControls from "./Pagination";
import ExtraMiniIndicator from "../../ui/miniActivityIndicator/extraMiniIndicator";
import NotificationTracks from "./NotificationTracks";

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

  const { fetchById, detail, isLoading } = useStoreApprovalNotification();

  const { fetchAll: fetchApprovalRaw, isLoading: isLoadingApprovalRaw } =
    useStoreApprovalRequestWithRelations();

  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);

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

  const handleCheckStatus = async (trackId: string) => {
    setActiveTrackId(trackId);
    try {
      await fetchById(trackId);
      // Setelah fetch, detail otomatis update dari Zustand
      fetchApprovalRaw();
    } catch (error) {
      console.error("Error fetching by id:", error);
    }
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
                  {row.getIsExpanded() &&
                    row.original.notificationTracks?.length > 0 && (
                      <tr>
                        <td colSpan={row.getVisibleCells().length}>
                          <NotificationTracks
                            notificationTracks={row.original.notificationTracks}
                            approverIds={row.original.approverIds}
                            activeTrackId={activeTrackId}
                            isLoading={isLoading}
                            detail={detail}
                            onCheckStatus={handleCheckStatus}
                          />
                        </td>
                      </tr>
                    )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
