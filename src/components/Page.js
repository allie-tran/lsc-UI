import React, {useState} from 'react'
import {Map} from "./Map";
import {Bar} from "./AppBar";
import {ImageGrid} from "./Images";

export const Page = () => {
    const [open, setOpen] = useState(true); // closed, open
    return (
        <div style={{height: 700, width: 1443, position:'fixed'}}>
            <Bar open={open}/>
            <Map open={open} changeStatus={stt=>setOpen(stt)}/>
            <ImageGrid open={open}/>
        </div>
    )
};