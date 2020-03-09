import React from 'react'
import {FilledInput, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
            searchContainer: {
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: "100%",
                height: 100,
                "& p": {
                    color: "#F4CDD2",
                    padding: 5
                }
            },
            searchBar: {
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
                width: props => props.type === "Main things:" ? "70%" : "50%",
                height: 40,
                backgroundColor: "#3B3B3B",
                borderRadius: "15px"
            },
            timeBar: {
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
                width: 50,
                height: 40,
                backgroundColor: "#3B3B3B",
                borderRadius: "15px"
            },
            input: {
                padding: 15,
                color: "#CCCCCC",
            }
        }));

export const SearchBar = (props) => {
    console.log(props);
    const classes = useStyles(props);
    const {type} = props;

    const Time = () => {
        if (type !== "Main things:") {
            return ([
                    <Typography>when</Typography>,
                    <FilledInput id="main-search"
                                 variant="filled"
                                 className={classes.timeBar}
                                 disableUnderline={true}
                                 inputProps={{
                                     className: classes.input
                                 }
                                 }
                    />]
            )
        }
        return null
    };

    return (
        <div className={classes.searchContainer}>
            <Typography>{type}</Typography>
            <FilledInput id="main-search"
                         variant="filled"
                         autoFocus={type === "Main things:"}
                         className={classes.searchBar}
                         disableUnderline={true}
                         inputProps={{className: classes.input}}
            />
            <Time/>
        </div>
    )
};