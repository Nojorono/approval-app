import React, { useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useStoreTransporter } from "../../../../../../DynamicAPI/stores/Store/MasterStore";
import TableComponent from "../../../../../../components/tables/MasterDataTable/TableComponent";
import ActIndicator from "../../../../../../components/ui/activityIndicator";

const TransporterDetail = (data: any) => {
  const IdInbound = data.data.id;
  const { fetchById, detail, isLoading } = useStoreTransporter();

  useEffect(() => {
    const fetchData = async () => {
      await fetchById(IdInbound);
    };

    fetchData();
  }, [IdInbound]);  

  // Mapping detail for table usage
  const mappedTransporterDetail = useMemo(() => {
    if (!detail || !Array.isArray(detail)) return [];
    return detail.map((item: any) => ({
      transporter_code_number: item.transporter_code_number || "",
      transporter_name: item.transporter_name || "",
      transporter_phone: item.transporter_phone || "",
      vehicle_type: item.vehicle?.vehicle_type || "",
      vehicle_brand: item.vehicle?.vehicle_brand || "",
      arrival_time: item.arrival_time || "",
      unloading_start_time: item.unloading_start_time || "",
      unloading_end_time: item.unloading_end_time || "",
      departure_time: item.departure_time || "",
    }));
  }, [detail]);

  const transporterColumns: ColumnDef<any>[] = [
    {
      header: "Plat Number",
      accessorKey: "transporter_code_number",
    },
    {
      header: "Driver Name",
      accessorKey: "transporter_name",
    },
    {
      header: "Phone",
      accessorKey: "transporter_phone",
    },
    {
      header: "Vehicle Type",
      accessorKey: "vehicle_type",
    },
    {
      header: "Vehicle Brand",
      accessorKey: "vehicle_brand",
    },
    {
      header: "Arrival Time",
      accessorKey: "arrival_time",
    },
    {
      header: "Unloading Start",
      accessorKey: "unloading_start_time",
    },
    {
      header: "Unloading End",
      accessorKey: "unloading_end_time",
    },
    {
      header: "Departure Time",
      accessorKey: "departure_time",
    },
  ];  

  return (
    <>
      {isLoading || detail == null ? (
        <ActIndicator />
      ) : (
        <>
          <TableComponent
            data={mappedTransporterDetail}
            columns={transporterColumns}
            pageSize={5}
          />
        </>
      )}
    </>
  );
};

export default TransporterDetail;
