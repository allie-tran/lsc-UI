import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import FilledInput from "@material-ui/core/FilledInput";
import Typography from "@material-ui/core/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { setTextAnswers } from "../redux/actions/qa";
import { submitImage } from "../redux/actions/submit";


const QAstyles = makeStyles((theme) => ({
  pane: {
    width: ({ isQuestion }) => (isQuestion ? "calc(12.55% - 10px)" : "0"),
    height: `calc(100% - 60px)`,
    position: "absolute",
    top: 60,
    left: 0,
    backgroundColor: "#272727",
    border: "5px solid #272727",
  },
  answer: {
    position: "absolute",
    bottom: 16,
    height: 48,
    width: "100%",
    zIndex: 5,
    color: "#eee",
    backgroundColor: "rgb(208 220 174)",
  },
  input: {
    padding: 15,
    color: "#000",
    "&:hover, &:focus": {
      color: "#fff",
    },
  },
  info: {
    padding: 10,
    color: "#CCCCCC",
  },
  mouse: {
    backgroundColor: "rgba(208 220 174 50)",
    color: "#fff",
    padding: 15,
  },
}));

const QAPane = ({ isQuestion, changeQuestion }) => {
  const classes = QAstyles({ isQuestion });
  const texts = useSelector((state) => state.qa.texts);
  const dispatch = useDispatch();
  const answerSceneResponse = useSelector(
    (state) => state.qa.answerSceneResponse
  );

  const copyText = (value) => {
    document.getElementById("answer").value = value;
    navigator.clipboard.writeText(value);
    }

  useEffect(
    () => {
      if (answerSceneResponse) {
        answerSceneResponse.then((res) => {
          if (res.data.texts) {
            dispatch(setTextAnswers(res.data.texts));
          }
        });
      }
    }, // eslint-disable-next-line
    [answerSceneResponse]
  );

  const keyPressed = (event) => {
    if (event.key === "Enter") dispatch(submitImage(document.getElementById("answer").value, false, true));
  };

  return isQuestion ? (
    <div className={classes.pane}>
      <Typography className={classes.info}>Some possible answers:</Typography>
      <List>
        {texts
          ? texts.map((answer, id) => (
              <ListItem disablePadding>
                <ListItemButton dense onClick={() => copyText(answer)}>
                  <ListItemText className={classes.info} primary={answer} />
                </ListItemButton>
              </ListItem>
            ))
          : null}
      </List>
      <FilledInput
        className={classes.answer}
        id={"answer"}
        placeholder="Type Answer Here"
        variant="filled"
        disableUnderline={true}
        inputProps={{ className: classes.input }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={() =>
                dispatch(
                  submitImage(
                    document.getElementById("answer").value,
                    false,
                    true
                  )
                )
              }
              //   onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              <CheckRoundedIcon></CheckRoundedIcon>
            </IconButton>
          </InputAdornment>
        }
        onKeyDown={keyPressed}
      />
      {/* <MouseTooltip visible={isMouseTooltipVisible} offsetX={15} offsetY={10}>
        <div className={classes.mouse}>Copied!</div>
      </MouseTooltip> */}
    </div>
  ) : null;
};

export default QAPane;
