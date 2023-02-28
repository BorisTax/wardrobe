import React from "react";
import { useSelector } from "react-redux";
import { Status } from "../reducers/functions";
import ProjectBar from "./ProjectBar";
import InstrumentsBar from "./InstrumentsBar";
import OperationsBar from "./OperationsBar";

export default function LeftSideBar() {
  const appData = useSelector(store => store)
  const disabled = (appData.status === Status.MEASURE || appData.status === Status.PAN)
  return (
    <div className="left-sidebar">
      <div className="sidebar-content">
        <ProjectBar disabled={disabled} />
        <InstrumentsBar/>
        <OperationsBar/>
        </div>
    </div>
  );
}
