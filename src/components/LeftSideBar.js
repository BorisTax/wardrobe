import React from "react";
import InformationBar from "./InformationBar";
import PropertyBar from "./PropertyBar";

export default function LeftSideBar() {
  return (
    <div className="left-sidebar">
      <div className="sidebar-content">
      <InformationBar/>
        
        <PropertyBar/>
        </div>
    </div>
  );
}
