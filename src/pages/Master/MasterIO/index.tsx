import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DataTable from "./Table/DataTable";

export default function MasterIO() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Master IO" }]} />
      <DataTable />
    </div>
  );
}
