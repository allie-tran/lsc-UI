import React, { useEffect, useState, Suspense, lazy } from "react";
import Popover from "@material-ui/core/Popover";
import { makeStyles } from "@material-ui/core/styles";
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import BookmarkBorderRoundedIcon from '@material-ui/icons/BookmarkBorderRounded';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';

const IMAGE_WIDTH = 1024
const IMAGE_HEIGHT = 768
const RESIZE_FACTOR = 6

const EventPopover = lazy(() => import('../redux/EventPopover-cnt'));

const thumbnailStyles = makeStyles(theme => ({
    image: {
        width: props => IMAGE_WIDTH / RESIZE_FACTOR * props.scale,
        height: props => IMAGE_HEIGHT / RESIZE_FACTOR * props.scale,
        borderRadius: 2,
        flexShrink: 0,
        marginTop: 0,
        marginBottom: 10,
        position: "relative",
        borderRadius: 2,
        border: "1px solid #E6E6E6"
    },
    row: {
        display: "flex",
    },
    card: {
        width: props => IMAGE_WIDTH / RESIZE_FACTOR * props.scale,
        height: props => IMAGE_HEIGHT / RESIZE_FACTOR * props.scale,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        marginTop: 10,
        marginBottom: 10
    },
    saveButton: {
        position: "absolute",
        left: props => IMAGE_WIDTH / RESIZE_FACTOR * props.scale - 25,
        top: props => IMAGE_HEIGHT / RESIZE_FACTOR * props.scale - 50,
        color: "#fff",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: 3,
        "&:hover": {
            backgroundColor: "#FF6584",
        }
    },
    submitButton: {
        position: "absolute",
        left: props => IMAGE_WIDTH / RESIZE_FACTOR * props.scale - 25,
        top: props => IMAGE_HEIGHT / RESIZE_FACTOR * props.scale - 25,
        color: "#fff",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: 3,
        "&:hover": {
            backgroundColor: "#FF6584",
        }
    },
    popover: {
        width: props => props.open ? "80%" : "98%"
    }
}));

const Thumbnail = ({ group, scale, saveScene, removeScene, index, saved, sendToMap, open, clearNextEvents, position }) => {
    const classes = thumbnailStyles({ scale, open });
    const [openPopover, setOpenPopover] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const openEvent = event => {
        console.log("Clicked");
        setOpenPopover(true);
        if (saved === undefined){
            sendToMap(index)
        }
        setAnchorEl(event.currentTarget);
    };

    const closeEvent = () => {
        setOpenPopover(false);
        setAnchorEl(null);
        clearNextEvents()
    };

    const AddRemove = () => {
        if (saved === undefined) {
            return [<BookmarkBorderRoundedIcon fontSize="small" className={classes.saveButton} onClick={() => saveScene(group)} />,
            <CheckRoundedIcon fontSize="small" className={classes.submitButton} />]
        }
        return (
            <DeleteOutlineRoundedIcon fontSize="small" className={classes.submitButton} onClick={() => removeScene(index)} />)
    }

    if (group.length > 0) {
        return ([
            <div className={classes.card}>
                <img
                    alt={group[0]}
                    src={"LSC_DATA/" + group[0]}
                    className={classes.image}
                    onClick={openEvent} />
                <AddRemove />
            </div>,
            //  <div className={classes.row}>
            // * <img
            //     alt={group[0]}
            //     src={"LSC_DATA/" + group[0]}
            //     className={classes.image}
            //     onClick={openEvent} />
            // <AddRemove /></div>,
            <Popover
                open={openPopover}
                anchorReference="anchorPosition"
                anchorPosition={{ top: 0, left: 0 }}
                anchorOrigin={{
                    vertical: "center",
                    horizontal: "center"
                }}
                transformOrigin={{
                    vertical: "center",
                    horizontal: "center"
                }}
                onBackdropClick={closeEvent}
                onEscapeKeyDown={closeEvent}
                className={classes.popover}
            >
                <Suspense fallback={<div>Loading...</div>}>
                    <EventPopover closeEvent={closeEvent} group={group} position={position} />
                </Suspense>
            </Popover>])
    }
    else {
        return <div className={classes.card} />;
    }
};

export default Thumbnail;
