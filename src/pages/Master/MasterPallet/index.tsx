import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ViewTable from "./Table/DataTable";

export default function MasterPallet() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Master Pallet" }]} />
      <ViewTable />
    </div>
  );
}
