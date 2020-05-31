import React, { useState, Suspense, lazy } from 'react'
import Map from "../redux/Map-cnt";
import Bar from "../redux/AppBar-cnt";
import SaveSection from '../redux/Save-cnt'
import Submit from '../redux/Submit-cnt'
const ImageGrid = lazy(() => import("../redux/Images-cnt"));


if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}

const Page = () => {
    const WIDTH = 1920; // 1920, 1443
    const HEIGHT = 945; // 945, 700
    const [open, setOpen] = useState(true); // closed, open
    return (
        <div style={{ height: HEIGHT, width: WIDTH, position: 'fixed' }}>  {/*700 * 1443, 945 x 1920*/}
            <Bar open={open} />
            <SaveSection open={open} />
            <Map open={open} changeStatus={stt => setOpen(stt)} />
            <Submit/>
            <Suspense fallback={<div></div>}>
                <ImageGrid open={open} height={HEIGHT} maxwidth={WIDTH} />\
            </Suspense>
        </div>
    )
};
Page.whyDidYouRender = true

export default Page;
