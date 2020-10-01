import React, {memo} from 'react'
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton'
import SearchBar from "./SearchBar";
import { makeStyles } from "@material-ui/core/styles";
import KeyboardReturnRoundedIcon from '@material-ui/icons/KeyboardReturnRounded';

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'fixed',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
        width: props => props.open ? "80%" : "97%",
        height: 60,
        backgroundColor: "#212121",
        top: 0, left: 0,
        zIndex: 4
    },
    icon: {
        padding: 10,
        marginRight: 10,
        backgroundColor: "#FF6584",
    }
}));

const Bar = memo(({ open, submitQuery }) => {
    const classes = useStyles({ open });

    return (
        <AppBar position="static" className={classes.appBar}>
            <SearchBar type="Before:" submitQuery={submitQuery} />
            <SearchBar type="Find:" submitQuery={submitQuery} />
            <SearchBar type="After:" submitQuery={submitQuery} />
            <IconButton size="small" className={classes.icon} onClick={() => submitQuery(false, 0)}>
                <KeyboardReturnRoundedIcon />
            </IconButton>
        </AppBar>
    )
}, () => true);

Bar.whyDidYouRender = true

export default Bar;
