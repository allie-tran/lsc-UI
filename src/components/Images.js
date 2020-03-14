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
    }

}));

const LoadingIndicator = props => {
    const classes = gridStyles()
    const { promiseInProgress } = usePromiseTracker();

    return (
        promiseInProgress && <ReactLoading type={"bubbles"} color={"white"} />
    );
}

const IMAGE_WIDTH = 1024
const IMAGE_HEIGHT = 768
const RESIZE_FACTOR = 6

const ImageGrid = ({ height, maxwidth, open, collection, setScene }) => {
    const classes = gridStyles({ open });
    const [scenes, setScenes] = useState([]);
    const { promiseInProgress } = usePromiseTracker();
    const gridRef = React.createRef();

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
    }, [collection]);

    useEffect(() => {
        setScene(scenes)
    }, [scenes])

    let ITEM_WIDTH = IMAGE_WIDTH / RESIZE_FACTOR * 2.5
    const width = open ? maxwidth * 0.7 : maxwidth * 0.9;
    const maxItemsPerRow = Math.max(Math.floor(width / ITEM_WIDTH), 1);
    ITEM_WIDTH = Math.floor(width / maxItemsPerRow)

    const Cell = memo(({ columnIndex, rowIndex, style }) => {
        if (rowIndex * maxItemsPerRow + columnIndex < scenes.length) {
            return (
                <Suspense fallback={<div style={style}></div>}>
                    <div style={{ ...style, display: 'flex', justifyContent: 'center' }}>
                        <Event style={style} scene={scenes[rowIndex * maxItemsPerRow + columnIndex]} />
                    </div>
                </Suspense>
            )
        }
        else {
            return <div style={style}></div>
        }
    }, areEqual);

    if (promiseInProgress) {
        return (
            <div className={classes.root}><LoadingIndicator /></div>
        )
    }
    else {
        return (
            <div className={classes.root}>
                <Typography variant="subtitle1" className={classes.text}>
                    Click an event thumbnail to view all images.
                </Typography>
                <Grid ref={gridRef}
                    columnCount={maxItemsPerRow}
                    columnWidth={ITEM_WIDTH}
                    height={height - 60}
                    rowCount={Math.max(Math.floor(scenes.length / maxItemsPerRow), 1)}
                    rowHeight={IMAGE_HEIGHT / RESIZE_FACTOR * 1.5}
                    width={width}
                >
                    {Cell}
                </Grid>
            </div >
        )
    }
};

export default ImageGrid;