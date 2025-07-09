// import ViewMasterUser from "./Table/ViewMasterUser";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DataTable from "./Table/DataTable";

export default function MasterUser() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Master User" }]} />
      <DataTable />
    </div>
  );
}



