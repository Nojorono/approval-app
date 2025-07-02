import { useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useStoreCheckerAssign } from "../../../../../DynamicAPI/stores/Store/MasterStore";
import TableComponent from "../../../../../components/tables/MasterDataTable/TableComponent";
import ActIndicator from "../../../../../components/ui/activityIndicator";

const ViewChecker = ({ data }: any) => {
  const IdInbound = data?.id;

  const {
    loadDetail,
    detail,
    isLoading,
    setCurrentId,
    resetDetail, // opsional untuk clean-up
  } = useStoreCheckerAssign();

  // 🧠 Gunakan loadDetail dan set currentId agar state reactive
  useEffect(() => {
    if (IdInbound) {
      setCurrentId(IdInbound);
      loadDetail(IdInbound);
    }

    // Optional: clear detail saat komponen unmount
    return () => {
      resetDetail();
    };
  }, [IdInbound]);

  const { status, checker_leader, checkers } = detail || {};

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    const pad = (n: number) => n.toString().padStart(2, "0");
    return (
      pad(date.getDate()) +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      date.getFullYear() +
      " " +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes())
    );
  };

  const mappedDetail = {
    checker_leader:
      checker_leader?.firstName && checker_leader?.lastName
        ? `${checker_leader.firstName} ${checker_leader.lastName}`
        : "-",
    checkers:
      Array.isArray(checkers) && checkers.length > 0
        ? checkers.map((c: any) => `${c.firstName} ${c.lastName}`).join(", ")
        : "-",
    status: status || "-",
    start_date: formatDateTime(detail?.assign_date_start) || "-",
    finish_date: formatDateTime(detail?.assign_date_finish) || "-",
  };

  const DetailsColumns: ColumnDef<any>[] = [
    {
      header: "Checker Leader",
      accessorKey: "checker_leader",
    },
    {
      header: "Checkers",
      accessorKey: "checkers",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Start Date",
      accessorKey: "start_date",
    },
    {
      header: "Finish Date",
      accessorKey: "finish_date",
    },
  ];

  return (
    <>
      {isLoading || detail == null ? (
        <ActIndicator />
      ) : (
        <>
          <TableComponent
            data={[mappedDetail]}
            columns={DetailsColumns}
            pageSize={5}
          />
        </>
      )}
    </>
  );
};

export default ViewChecker;
