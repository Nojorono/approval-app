import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ApprovalTable from "./ApprovalTable";
import DataTable from "./Table/DataTable";

export default function MasterBin() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Approval Page Process" }]} />
      <ApprovalTable />
    </div>
  );
}
