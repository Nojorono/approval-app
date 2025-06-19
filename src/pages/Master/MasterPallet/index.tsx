import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DataTable from "./Table/DataTable";

export default function MasterPallet() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Master Pallet" }]} />
      <DataTable />
    </div>
  );
}
