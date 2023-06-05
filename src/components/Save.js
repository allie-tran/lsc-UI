import React, { useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import Typography from '@material-ui/core/Typography';
import Thumbnail from './Thumbnail';
import { makeStyles } from '@material-ui/core/styles';
import BookmarkRoundedIcon from '@material-ui/icons/BookmarkRounded';
import Badge from "@material-ui/core/Badge"
import {submitAll} from "../redux/actions/submit";
import { clearSaved } from "../redux/actions/save";
import useSound from "use-sound";
import sfxSound from "../navigation_transition-right.wav";

import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    section: {
        position: "fixed",
        left: (props) => (props.open ? "80%" : "97%"),
        width: "20%",
        height: "100%",
        filter: (props) => (props.open ? "none" : "brightness(70%)"),
        zIndex: 3,
        top: "calc(70% + 60px)",
        margin: 0,
        backgroundColor: "#272727",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    title: {
        padding: 10,
        color: "#CCCCCC",
    },
    divider: {
        color: "#CCCCCC",
    },
    icon: {
        position: "relative",
        top: 6,
        marginLeft: 5,
        color: "#FF6584",
    },
    imageContainer: {
        width: "100%",
        maxHeight: "95%",
        overflow: "scroll",
        height: "95%",
    },
    list: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "center",
        height: "100%",
        paddingTop: "5%",
        // flexWrap: "wrap-reverse"
        overflowX: "scroll",
    },
    button: {
        height: 16,
        padding: 0,
    },
}));


var isEqual = require('lodash.isequal');

const areEqual = (prev, next) => {
    return isEqual(prev.saved, next.saved);
}

const SaveSection = memo(({ open, openEvent }) => {
    const [play] = useSound(sfxSound);
	const classes = useStyles({ open });
    const saved = useSelector(state => state.save.saved, isEqual)
    const dispatch = useDispatch();
	useEffect(
		() => {
			var section = document.getElementById('save-section');
			section.scrollTop = 0;
		},
		[ saved ]
	);
	return (
    <div id="save" className={classes.section}>
      <Typography variant="subtitle1" className={classes.title}>
        SAVED SCENES
        <Badge badgeContent={saved.length} color="primary" overlap="rectangular">
          <BookmarkRoundedIcon />
        </Badge>
      </Typography>
      {/*<Button
                onClick={() => {play(); dispatch(clearSaved()); dispatch(submitAll(saved))}}
                className={classes.button}
            >
                Submit All
            </Button>*/}
      <div className={classes.imageContainer} id="save-section">
        <div className={classes.list}>
          {/* {saved.length % 2 !== 0 ? <Hidden key="Hidden" /> : null} */}
          {saved.map((scene, index) => (
            <Thumbnail
              key={"saved:" + scene[0] + index}
              saved
              group={scene}
              scale={0.7}
              index={index}
              last={index === 0}
              openEvent={openEvent}
            />
          ))}
        </div>
      </div>
    </div>
  );
	// 	);
	// } else {
	// 	return (
	// 		<div id="save" className={classes.section}>
	// 			<Typography variant="subtitle1" className={classes.title}>
	// 				SAVED SCENES
	// 				<Badge badgeContent={saved.length} color="primary">
	// 					<BookmarkRoundedIcon />
	// 				</Badge>
	// 			</Typography>

	// 		</div>
	// 	);
	// }
}, areEqual);

SaveSection.whyDidYouRender=true

export default SaveSection;
