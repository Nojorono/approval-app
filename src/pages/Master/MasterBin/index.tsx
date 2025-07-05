import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DataTable from "./Table/DataTable";

export default function MasterBin() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Master Bin" }]} />
      <DataTable />
    </div>
  );
}
