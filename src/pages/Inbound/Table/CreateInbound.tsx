import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
// import ViewTable from "././Table/DataTable";

export default function InboundPlanning() {
  return (
    <div>
      <PageBreadcrumb
        breadcrumbs={[
          { title: "Inbound Planning", path: "/inbound_planning" },
          { title: "Create Inbound Planning" },
        ]}
      />
    </div>
  );
}
