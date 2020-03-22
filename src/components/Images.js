import React, { useEffect, useState, Suspense, lazy, memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FixedSizeGrid as Grid, areEqual } from 'react-window';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import ReactLoading from "react-loading";
import Typography from '@material-ui/core/Typography';
const Event = lazy(() => import('./Event'));

const gridStyles = makeStyles(theme => ({
    root: {
        width: props => (props.open ? "80%" : "97%"),
        height: `calc(100% - 60px)`,
        zIndex: -1,
        top: 60,
        position: "fixed",
        overflow: "scroll",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    grid: {
        flexGrow: 1,
        justifyContent: "space-evenly",
        backgroundImage: `linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.15) 50%)`,
        backgroundPosition: `0px -20px`,
        backgroundRepeat: "repeat",
        backgroundSize: `770px 313px`
    },
    text: {
        top: 50,
        padding: 20,
        color: "#CCCCCC"
    },
    scrollbox: {
        display: "flex",
        height: props => props.height,
        flexDirection: "column",
        alignItems: "center"
    },
    textend: {
        top: -50,
        color: "#CCCCCC",
        position: "relative"
    }

}));

const LoadingIndicator = props => {
    const { promiseInProgress } = usePromiseTracker();

    return (
        promiseInProgress && <ReactLoading type={"bubbles"} color={"white"} />
    );
}

const IMAGE_WIDTH = 1024
const IMAGE_HEIGHT = 768
const RESIZE_FACTOR = 6.5

const ImageGrid = ({ height, maxwidth, open, collection, setScene, markersSelected, currentMarker, setQueryBound }) => {
    const classes = gridStyles({ open, height });
    const [scenes, setScenes] = useState([]);
    const [bottom, setBottom] = useState(false);
    const { promiseInProgress } = usePromiseTracker();
    const gridRef = React.createRef();

    let ITEM_WIDTH = IMAGE_WIDTH / RESIZE_FACTOR * 2.5
    const width = open ? maxwidth * 0.8 : maxwidth * 0.97;
    const maxItemsPerRow = Math.max(Math.floor(width / ITEM_WIDTH), 1);
    ITEM_WIDTH = Math.floor(width / maxItemsPerRow)

    useEffect(() => {
        if (gridRef.current !== null) {
            gridRef.current.scrollToItem({
                columnIndex: 0,
                rowIndex: 0
            })
        };
        trackPromise(collection.then(res => {
            setScenes(res.data.results);
        }));
    // eslint-disable-next-line
    }, [collection]);

    useEffect(() => {
        setScene(scenes)
        setBottom(scenes.length / maxItemsPerRow === 4)
        setQueryBound(null)
    // eslint-disable-next-line
    }, [scenes])

    useEffect(() => {
        console.log(currentMarker)
        if (currentMarker >= 0 && markersSelected.length>0) {
            const index = markersSelected[currentMarker]
            gridRef.current.scrollToItem({
                columnIndex: index % maxItemsPerRow,
                rowIndex: Math.round(index / maxItemsPerRow),
                align: "center"
            })
        }
    // eslint-disable-next-line
    }, [markersSelected, currentMarker])

    const Cell = memo(({ columnIndex, rowIndex, style }) => {
        if (rowIndex * maxItemsPerRow + columnIndex < scenes.length) {
            const index = rowIndex * maxItemsPerRow + columnIndex
            return (
                <Suspense fallback={<div style={style}></div>}>
                    <div style={{ ...style, display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: "center",
                                  backgroundColor: rowIndex % 2 !== 0? "none": "rgba(0, 0, 0, 0.15)"}}>
                        <Event index={index} style={style} scene={scenes[index]} open={open} />
                    </div>
                </Suspense>
            )
        }
        else {
            return <div style={style}></div>
        }
    }, areEqual);

    const scrollCheck = (event) => {
        const checkBottom =
            event.target.scrollHeight - event.target.scrollTop ===
            event.target.clientHeight;
        if (checkBottom !== bottom) {
            setBottom(checkBottom);
        }
    };

    if (promiseInProgress) {
        return (
            <div className={classes.root}><LoadingIndicator /></div>
        )
    }
    else {
        return (
            <div className={classes.root} >
                <Typography variant="subtitle1" className={classes.text}>
                    Click an event thumbnail to view all images.
                </Typography >
                <div onScroll={scrollCheck} className={classes.scrollbox}>
                    <Grid ref={gridRef}
                        columnCount={maxItemsPerRow}
                        columnWidth={ITEM_WIDTH}
                        height={height - 60}
                        rowCount={Math.max(Math.floor(scenes.length / maxItemsPerRow), 1)}
                        rowHeight={IMAGE_HEIGHT / RESIZE_FACTOR * 1.8}
                        width={width}
                    >
                        {Cell}
                    </Grid>
                     {bottom ? <Typography variant="subtitle1" className={classes.textend}>
                        End of results.
                    </Typography> : null}
                </div>
            </div >
        )
    }
};

export default ImageGrid;
