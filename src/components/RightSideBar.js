import React from "react";
import { useSelector } from "react-redux";
import { Status } from "../reducers/functions";
import InformationBar from "./InformationBar";
import PropertyBar from "./PropertyBar";
import SettingsBar from "./SettingsBar";

export default function RightSideBar(props) {
  const appData = useSelector(store => store)
  const disabled = ( appData.status === Status.PAN)
  return (
    <div className="right-sidebar" >
      <div className="sidebar-content">
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
