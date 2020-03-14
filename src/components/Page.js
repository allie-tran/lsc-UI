import React, { useState, Suspense, lazy } from 'react'
import Map from "./Map";
import Bar from "../redux/AppBar-cnt";
import SaveSection from '../redux/Save-cnt'
const ImageGrid = lazy(() => import("../redux/Images-cnt"));

const Page = () => {
    const WIDTH = 1443; // 1920, 1443
    const HEIGHT = 700; // 945, 700
    const [open, setOpen] = useState(true); // closed, open
    return (
        <div style={{ height: HEIGHT, width: WIDTH, position: 'fixed' }}> // 700 * 1443, 945 x 1920 
            <Bar open={open} />
            <SaveSection open={open} />
            <Map open={open} changeStatus={stt => setOpen(stt)} />
            <Suspense fallback={<div></div>}>
                <ImageGrid open={open} height={HEIGHT} maxwidth={WIDTH} />\
            </Suspense>
        </div>
    )
};

export default Page;