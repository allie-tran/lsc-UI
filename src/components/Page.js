import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Map from "./Map";
import Bar from "./AppBar";
import SaveSection from "./Save";
import AutoComplete from "./AutoComplete";
import QAPane from "./QA"
import Popover from "@material-ui/core/Popover";
import { makeStyles } from "@material-ui/core/styles";
import EventPopover from "./EventPopover";
import ImageGrid from "./Images";
import {
    getSimilar,
    getNextScenes,
    setFinishedSearch,
    getInfo,
} from "../redux/actions/search";
import { getImages } from "../redux/actions/search";
import { resetSelection } from "../redux/actions/select";
import { startTimer, submitImage } from "../redux/actions/submit";
import Snackbar from "@material-ui/core/Snackbar";
import useSound from "use-sound";
import sfxSound from "../navigation_transition-right.wav";
import MuiAlert from "@mui/material/Alert";
import KeyboardCommandKeyIcon from "@mui/icons-material/KeyboardCommandKey";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Collapse from "@mui/material/Collapse";

// Alert for submitting
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const popoverStyles = makeStyles((theme) => ({
  autocomplete: {
    top: 60,
    right: 5,
    position: "fixed",
  },
  snackbar: {
    whiteSpace: "pre-wrap",
    zIndex: 10,
  },
  buttons: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 10,
  },
}));

if (process.env.NODE_ENV === "development") {
    const whyDidYouRender = require("@welldone-software/why-did-you-render");
    whyDidYouRender(React, {
        trackAllPureComponents: true,
    });
}

const Page = () => {
    const [play] = useSound(sfxSound);
    const WIDTH = window.innerWidth; // 1920, 1443
    const HEIGHT = window.innerHeight; // 1920; // 945, 700
    const classes = popoverStyles();
    const dispatch = useDispatch();
    const [openPopover, setOpenPopover] = useState(false);
    const [buttonValues, setButtonValues] = useState([]);
    const shiftHeld = useRef();
    const commandHeld = useRef();

    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [snackBarSeverity, setSnackBarSeverity] = useState("info");
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [initialImage, setInitialImage] = useState(null);
    const submitResponse = useSelector((state) => state.submit.submitResponse);

    useEffect(() => {
        if (submitResponse) {
            submitResponse.then((res) => {
                setOpenSnackBar(true);
                var message = res.data.description;
                console.log(message);
                setSnackBarMessage(message);
                if (message.includes("Correct")) {
                    setSnackBarSeverity("success");
                } else if (message.includes("Incorrect")) {
                    setSnackBarSeverity("error");
                } else if (message.includes("Unauthorized")) {
                    setSnackBarSeverity("warning");
                    console.log("Warning");
                } else {
                    setSnackBarSeverity("info");
                }
            });
        }
    }, [submitResponse]);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackBar(false);
    };

    const downHandler = useCallback(
        (e) => {
            if (e.key === "Shift") {
                // console.log("Shift pressed");
                shiftHeld.current = true;
                commandHeld.current = false;
                // setShiftHeld(true);
                setButtonValues(["Shift"])
            }
            else if (e.key === "Meta") {
                commandHeld.current = true;
                shiftHeld.current = false;
                setButtonValues(["Command"]);
            }
        },
        []
    );

    const upHandler = useCallback(
        (e) => {
            if (e.key === "Shift") {
                // console.log("Shift released");
                // setShiftHeld(false);
                shiftHeld.current = false;
                setButtonValues([]);
            } else if (e.key === "Meta") {
                commandHeld.current = false;
                setButtonValues([]);
            }
        },
        []
    );

    const [isQuestion, setQuestion] = useState(false);
    const changeQuestion = useCallback(
      (event) => {
        setQuestion(event.target.checked);
        // navigator.clipboard.writeText(
        // document.getElementById("Find:").value
        // );
      },
      []
    );

    const submitQuery = useCallback(
      (ignoreInfo, starting_from, share_info) => {
        let query = {
          before: document.getElementById("Before:")
            ? document.getElementById("Before:").value
            : null,
          beforewhen: document.getElementById("Before:-when")
            ? document.getElementById("Before:-when").value
            : null,
          current: document.getElementById("Find:").value,
          after: document.getElementById("After:")
            ? document.getElementById("After:").value
            : null,
          afterwhen: document.getElementById("After:-when")
            ? document.getElementById("After:-when").value
            : null,
          question: document.getElementById("question")
            ? document.getElementById("question").value
            : null,
          isQuestion: isQuestion,
        };
        console.log(query);
        window.scrollTo(0, 0);
        dispatch(resetSelection());
        dispatch(setFinishedSearch(starting_from));
        dispatch(getImages(query, ignoreInfo, starting_from, share_info));
        dispatch(startTimer());
      },
      [dispatch, isQuestion]
    );

    const openEvent = useCallback(
        (newGroup) => {
            if (shiftHeld.current) {
                setOpenSnackBar(false);
                play();
                dispatch(submitImage(newGroup[0], false, false));
            } else {
                dispatch(getSimilar(newGroup[0]));
                dispatch(getNextScenes(newGroup, "full"));
                dispatch(getInfo(newGroup[0]));
                setOpenPopover(true);
                if (newGroup[0] !== initialImage)
                {
                    setInitialImage(newGroup[0]);
                }
            }
        },
        [play, initialImage]
    );

    const closeEvent = useCallback((event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown" || reason === "clickaway") {
            setOpenPopover(false);
        }
        // eslint-disable-next-line
    }, []);


    return (
      <div
        tabIndex="0"
        onKeyDown={downHandler}
        onKeyUp={upHandler}
        style={{ height: HEIGHT, width: WIDTH, position: "fixed" }}
      >
        {" "}
        {/*700 * 1443, 945 x 1920*/}
        <Bar
          open={true}
          submitQuery={submitQuery}
          isQuestion={isQuestion}
          changeQuestion={changeQuestion}
        />
        {/* <AutoComplete className={classes.autocomplete} /> */}
        <Map open={true} />
        <QAPane isQuestion={isQuestion} />
        <SaveSection open={true} openEvent={openEvent} />
        <ToggleButtonGroup className={classes.buttons} value={buttonValues}>
          <ToggleButton value="Shift" color="warning">
            <FileUploadIcon />
          </ToggleButton>
          <ToggleButton value="Command" color="warning">
            <KeyboardCommandKeyIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        {/* <Submit /> */}
        <ImageGrid open={true} openEvent={openEvent} isQuestion={isQuestion} />
        <Popover
          // disablePortal={true}
          open={openPopover}
          anchorReference="anchorPosition"
          anchorPosition={{ top: 0, left: 0 }}
          anchorOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
          onClose={closeEvent}
          TransitionComponent={Collapse}
        >
          <EventPopover
            shiftHeld={shiftHeld}
            commandHeld={commandHeld}
            openEvent={openEvent}
            initialImage={initialImage}
          />
        </Popover>
        <Snackbar
          open={openSnackBar}
          autoHideDuration={2000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            className={classes.snackbar}
            onClose={handleClose}
            severity={snackBarSeverity}
            sx={{ width: "100%" }}
          >
            {snackBarMessage}
          </Alert>
        </Snackbar>
      </div>
    );
};
Page.whyDidYouRender = true;

export default Page;
