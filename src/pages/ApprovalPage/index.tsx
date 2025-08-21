import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DataTable from "./Table/DataTable";

export default function MasterBin() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Approval Page Process" }]} />
      <DataTable />
    </div>
  );
}
