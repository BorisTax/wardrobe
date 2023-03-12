import React from 'react';

export default function ToolButtonBar(props) {
        return <>
                <div style={{ display: "flex", gap: "0.2em",alignItems: "stretch" }}>
                        {props.children}
                </div>
        </>
}
