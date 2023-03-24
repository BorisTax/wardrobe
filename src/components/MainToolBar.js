import React from 'react';
import { useSelector } from 'react-redux';
import { WORKSPACE } from '../reducers/initialState';
import DimensionsBar from './DimensionsBar';
import FasadeDimensionsBar from './FasadeDimensionsBar';
import FasadInstrumentsBar from './FasadInstrumentsBar';
import InstrumentsBar from './InstrumentsBar';
import OperationsBar from './OperationsBar';
import ProjectBar from './ProjectBar';
import ToolBar from './ToolBar';
import ToolButtonBar from './ToolButtonBar';
import ToolButtonSeparator from './ToolButtonSeparator';
import WorkspaceBar from './WorkspaceBar';

export default function MainToolBar({disabled}) {
    const workspace = useSelector(store => store.workspace)
    return <ToolBar noTitle={true} font={"small"}>
        <ToolButtonBar>
            <ProjectBar/>
            <WorkspaceBar/>
            {workspace === WORKSPACE.CORPUS?
                <>
                    <ToolButtonSeparator/>
                    <InstrumentsBar/>
                    <ToolButtonSeparator/>
                    <DimensionsBar/>
                </>:
                <>
                <FasadInstrumentsBar/>
                <ToolButtonSeparator/>
                <FasadeDimensionsBar/>
                </>
            }
            <ToolButtonSeparator/>
            <OperationsBar/>
        </ToolButtonBar>

    </ToolBar>

}
