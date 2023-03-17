import React from 'react';
import DimensionsBar from './DimensionsBar';
import InstrumentsBar from './InstrumentsBar';
import OperationsBar from './OperationsBar';
import ProjectBar from './ProjectBar';
import ToolBar from './ToolBar';
import ToolButtonBar from './ToolButtonBar';
import ToolButtonSeparator from './ToolButtonSeparator';
import WorkspaceBar from './WorkspaceBar';

export default function MainToolBar({disabled}) {
    return <ToolBar noTitle={true} font={"small"}>
        <ToolButtonBar>
            <ProjectBar/>
            <ToolButtonSeparator/>
            <InstrumentsBar/>
            <ToolButtonSeparator/>
            <DimensionsBar/>
            <ToolButtonSeparator/>
            <OperationsBar/>
            <WorkspaceBar/>
        </ToolButtonBar>

    </ToolBar>

}
