import React from 'react'
import {AppBar, Typography, IconButton} from '@material-ui/core/';
import {SearchBar} from "./SearchBar";
import {makeStyles} from "@material-ui/core/styles";
import KeyboardReturnRoundedIcon from '@material-ui/icons/KeyboardReturnRounded';

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'fixed',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        width: props=>props.open?"80%": "97%",
        height: 60,
        backgroundColor: "#212121",
        top: 0, left: 0,
        zIndex: 4
    },
    icon: {
        padding:10,
        marginRight:10,
        backgroundColor: "#FF6584",
    }
}));

export const Bar = (props) => {
    const classes = useStyles(props);
    return (
        <AppBar position="static" className={classes.appBar}>
            <SearchBar type="Before:"/>
            <SearchBar type="Main things:"/>
            <SearchBar type="After:"/>
            <IconButton size="small" className={classes.icon}>
                <KeyboardReturnRoundedIcon/>
            </IconButton>
        </AppBar>

    )
};