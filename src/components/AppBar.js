import React, { memo, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
// import Button from '@material-ui/core/Button'
import SearchBar from "./SearchBar";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import Typography from '@material-ui/core/Typography';
import LoginIcon from "@mui/icons-material/Login";
import { login } from "../redux/actions/submit";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import TextField from "@mui/material/TextField";
import Button from "@material-ui/core/Button";


const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "fixed",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    height: 60,
    backgroundColor: "#212121",
    top: 0,
    left: 0,
    zIndex: 4,
  },
  appBar2: {
    position: "fixed",
    width: ({open}) => (open ? "80%" : "100%"),
    height: 30,
    backgroundColor: "#272727",
    top: 60,
    left: 0,
    zIndex: 3,
    paddingLeft: ({ isQuestion }) => (isQuestion ? "16%" : 0),
  },
  realSpace: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    height: 30,
    backgroundColor: "#272727",
    zIndex: 1,
  },
  icon: {
    padding: 10,
    marginRight: 10,
    backgroundColor: "#FF6584",
  },
  text: {
    color: "#888888",
    cursor: "default",
    flexShrink: 0,
  },
  button: {
    color: "#000000",
  }
}));

const Bar = memo( function Bar({ open, submitQuery, isQuestion, changeQuestion}) {
    const classes = useStyles({ open, isQuestion });
    const [openLogin, setOpenLogin] = useState(false);
    const [sessionID, setSessionID] = useState("test");

    const dispatch = useDispatch();

    const handleClickOpen = () => {
      setOpenLogin(true);
    };

    const handleClose = () => {
      setOpenLogin(false);
    };
    
    const visualisation = useSelector((state) => state.search.info? state.search.info.query_visualisation:null);
    console.log(isQuestion);

    return (
      <span>
        <AppBar key="1" className={classes.appBar}>
          <SearchBar type="Before:" submitQuery={submitQuery} />
          <SearchBar
            type="Find:"
            submitQuery={submitQuery}
            changeQuestion={changeQuestion}
            isQuestion={isQuestion}
          />
          <SearchBar type="After:" submitQuery={submitQuery} />
          <Tooltip title="Clear All" arrow>
            <span>
              <IconButton
                size="small"
                className={classes.icon}
                onClick={() => {
                  window.location.reload();
                  return false;
                }}
              >
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Login" arrow>
            <span>
              <IconButton
                size="small"
                className={classes.icon}
                onClick={handleClickOpen}
              >
                <LoginIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Search" arrow>
            <span>
              <IconButton
                size="small"
                className={classes.icon}
                onClick={() => submitQuery(false, 0, false)}
              >
                <SearchIcon />
              </IconButton>
            </span>
          </Tooltip>
        </AppBar>
        <AppBar key="2" className={classes.appBar2}>
          <div className={classes.realSpace}>
            {visualisation
              ? visualisation.map((text, index) => {
                  return (
                    <Typography
                      key={index.toString() + text[0]}
                      variant="body1"
                      className={classes.text}
                    >
                      {(index > 0 ? " | " : "") + text[0] + ": " + text[1]}
                    </Typography>
                  );
                })
              : null}
          </div>
        </AppBar>
        <Dialog open={openLogin} onClose={handleClose}>
          <DialogTitle>Log In</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="login"
              label="session_id"
              variant="standard"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSessionID(event.target.value);
              }}
              value={sessionID}
            />
          </DialogContent>
          <DialogActions>
            <Button className={classes.button} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              className={classes.button}
              onClick={() => {handleClose(); dispatch(login(sessionID));}}
            >
              Log In
            </Button>
          </DialogActions>
        </Dialog>
      </span>
    );
});

Bar.whyDidYouRender = true

export default Bar;
