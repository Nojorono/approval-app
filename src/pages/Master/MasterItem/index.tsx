import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DataTable from "./Table/DataTable";

export default function MasterItem() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Master Item" }]} />
      <DataTable />
    </div>
  );
}
