import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DataTable from "./Table/DataTable";

export default function MasterClassification() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Master Classification" }]} />
      <DataTable />
    </div>
  );
}
