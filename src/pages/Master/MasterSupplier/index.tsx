import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DataTable from "./Table/DataTable";

export default function MasterSupplier() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Master Supplier" }]} />
      <DataTable />
    </div>
  );
}
