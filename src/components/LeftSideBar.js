import React from "react";
import { useSelector } from "react-redux";
import { Status } from "../reducers/functions";
import ProjectBar from "./ProjectBar";
import InstrumentsBar from "./InstrumentsBar";
import InformationBar from "./InformationBar";
import SettingsBar from "./SettingsBar";
import PropertyBar from "./PropertyBar";

export default function LeftSideBar(props) {
  const appData = useSelector(store => store)
  const disabled = (appData.status === Status.MEASURE || appData.status === Status.PAN)
  return (
    <div className="left-sidebar">
      <div className="sidebar-content">
        <ProjectBar disabled={disabled} />
        <InstrumentsBar/>
        <InformationBar disabled={disabled} />
        <PropertyBar
        />
        <SettingsBar
          disabled={disabled}
          settings={{deleteConfirm: appData.deleteConfirm }}
        />
        </div>
    </div>
  );
}
