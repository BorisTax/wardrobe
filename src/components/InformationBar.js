import React from 'react';
import { useSelector } from 'react-redux';
import { TreeView } from '@material-ui/lab'
import TreeItem from "@material-ui/lab/TreeItem";
import  ExpandMoreIcon  from '@mui/icons-material/ExpandMore'
import  ChevronRightIcon  from '@mui/icons-material/ChevronRight'
import { withStyles } from "@material-ui/core/styles";
import ToolBar from './ToolBar';
import MaterialBar from './MaterialBar';

// const TreeItem = withStyles({
//     selected: {
//       color: "red"
//     }
//   })(MuiTreeItem);

export default function InformationBar({ disabled }) {
    const captions = useSelector(store => store.captions.toolbars.info)
    const appData = useSelector(store => store)
    const data = getInfoData(appData)
    const renderTree = (nodes) => (
        <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name} >
            {Array.isArray(nodes.children)
                ? nodes.children.map((node) => renderTree(node))
                : null}
        </TreeItem>
    );
    return <ToolBar caption={captions.title}>
        {data.map(d =>
            <TreeView
            aria-label="rich object"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={['root']}
            defaultExpandIcon={<ChevronRightIcon />}
            
            >
                {renderTree(d)}
            </TreeView>
            )}
    </ToolBar>
}

function getInfoData(appData) {
    const caps = appData.captions.toolbars.info
    const data = [
        {
                id: "wardrobe",
                name: caps.wardrobe.title,
                children: [
                    { id: "width", name: caps.wardrobe.width },
                    { id: "depth", name: caps.wardrobe.depth },
                    { id: "height", name: caps.wardrobe.height },
                ]
            },
            {
                id: "materials",
                name: caps.materials.title,
                children: [
                    { id: "DSPColor", name: <MaterialBar/> },
                ]
            }
        ]
    return data
}
