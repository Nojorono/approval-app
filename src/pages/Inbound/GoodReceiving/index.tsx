import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ViewTable from "./Table/DataTable";

export default function GoodReceive() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Good Receive List" }]} />
      <ViewTable />
    </div>
  );
}
