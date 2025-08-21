// PAGE MASTER
import MasterUser from "../pages/Master/MasterUser";
import MasterMenu from "../pages/Master/MasterMenu";

// MASTER ROLES PAGE
import MasterRole from "../pages/Master/MasterRole";
import CreateRole from "../pages/Master/MasterRole/Screen/CreateRole";
import UpdateRole from "../pages/Master/MasterRole/Screen/UpdateRole";

// APPROVAL REQUEST
import ApprovalRequest from '../pages/ApprovalRequest'
import { ApprovalProcess } from '../pages/ApprovalProcess/[id].tsx'
import ApprovalProcessDetail from '../pages/ApprovalProcess/ApprovalProcessDetail.tsx'

import Dashboard from '../pages/Dashboard'
import ApprovalProcessResult from "../pages/ApprovalProcess/ApprovalProcessResult.tsx";
import ApprovalPage from "../pages/ApprovalPage/index.tsx";

export {
  // PAGE MASTER
  MasterUser,
  MasterMenu,

  // MASTER ROLES PAGE
  MasterRole,
  CreateRole,
  UpdateRole,
  
  ApprovalRequest,
  ApprovalProcess,
  ApprovalProcessDetail,
  ApprovalProcessResult,
  ApprovalPage,
  Dashboard
};
