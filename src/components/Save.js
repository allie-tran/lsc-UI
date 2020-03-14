import React, { useEffect } from 'react'
import Typography from '@material-ui/core/Typography';
import Thumbnail from "../redux/Thumbnail-cnt"
import { makeStyles } from '@material-ui/core/styles';
import BookmarkRoundedIcon from '@material-ui/icons/BookmarkRounded';
import Badge from "@material-ui/core/Badge"


const useStyles = makeStyles(theme => ({
    section: {
        position: "fixed",
        left: props => props.open ? "80%" : "97%",
        width: "20%",
        height: "100%",
        filter: props => props.open ? "none" : "brightness(70%)",
        zIndex: 3,
        top: 0,
        margin: 0,
        backgroundColor: "#272727",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    title: {
        padding: 10,
        color: "#CCCCCC"
    },
    divider: {
        color: "#CCCCCC"
    },
    icon: {
        position: "relative",
        top: 6,
        marginLeft: 5,
        color: "#FF6584"
    },
    imageContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignContent: "space-between",
        height: "44%",
        overflow: "scroll"
    }
}));

const SaveSection = ({ open, saved, removeScene }) => {
    const classes = useStyles({ open });
    console.log(saved)
    return (
        <div id="save" className={classes.section}>
            <Typography variant="subtitle1" className={classes.title}>
                SAVED SCENES
                <Badge badgeContent={saved.length} color="primary">
                    <BookmarkRoundedIcon />
                </Badge>
            </Typography>

            <div className={classes.imageContainer}>
                {saved.map((scene, index) =>
                    <Thumbnail group={scene} scale={0.7} index={index} />
                )}
            </div>
        </div>
    )
};
export default SaveSection;