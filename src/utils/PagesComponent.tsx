// PAGE MASTER
import MasterUser from "../pages/Master/MasterUser";
import MasterMenu from "../pages/Master/MasterMenu";

// MASTER ROLES PAGE
import MasterRole from "../pages/Master/MasterRole";
import CreateRole from "../pages/Master/MasterRole/Screen/CreateRole";
import UpdateRole from "../pages/Master/MasterRole/Screen/UpdateRole";

import Inbound from "../pages/Inbound/InboundPlanning";
import CreateInbound from "../pages/Inbound/InboundPlanning/Table/Create/CreateInbound";
import MasterPallet from "../pages/Master/MasterPallet";
import MasterUOM from "../pages/Master/MasterUOM";
import MasterIO from "../pages/Master/MasterIO";
import MasterWarehouse from "../pages/Master/MasterWarehouse";
import MasterItem from "../pages/Master/MasterItem";
import MasterClassification from "../pages/Master/MasterClassification";
import MasterVehicle from "../pages/Master/MasterVehicle";
import MasterSubWarehouse from "../pages/Master/MasterSubWarehouse";
import MasterBin from "../pages/Master/MasterBin";
import MasterSource from "../pages/Master/MasterSource";
import MasterSupplier from "../pages/Master/MasterSupplier";
import DetailInbound from "../pages/Inbound/InboundPlanning/Table/Detail/DetailInbound";
import GoodReceiving from "../pages/Inbound/GoodReceiving";


import AprrovalTracker from '../pages/AprrovalTracker'
import Dashboard from '../pages/Dashboard'

export {
  // PAGE MASTER
  MasterUser,
  MasterMenu,
  MasterPallet,
  MasterUOM,
  MasterIO,
  MasterWarehouse,
  MasterItem,
  MasterClassification,
  MasterVehicle,
  MasterSubWarehouse,
  MasterBin,
  MasterSource,
  MasterSupplier,

  // MASTER ROLES PAGE
  MasterRole,
  CreateRole,
  UpdateRole,

  // INBOUND PLANNING
  Inbound,
  CreateInbound,
  DetailInbound,

  // GOOD RECEIVING
  GoodReceiving,
  
  AprrovalTracker,
  Dashboard
};
