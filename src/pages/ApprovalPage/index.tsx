import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ApprovalTable from "./ApprovalTable";

export default function MasterBin() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "History Approval Page" }]} />
      <ApprovalTable />
    </div>
  );
}
