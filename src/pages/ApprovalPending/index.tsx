import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ApprovalPendingTable from "./Table";

export default function MasterBin() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Approval Pending Page" }]} />
      <ApprovalPendingTable />
    </div>
  );
}
