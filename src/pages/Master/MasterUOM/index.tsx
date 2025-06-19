import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DataTable from "./Table/DataTable";

export default function MasterUOM() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Master UOM" }]} />
      <DataTable />
    </div>
  );
}
