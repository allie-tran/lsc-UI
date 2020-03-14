import React, { useEffect } from 'react'
import KeyboardArrowLeftRoundedIcon from '@material-ui/icons/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@material-ui/icons/KeyboardArrowRightRounded';
import IconButton from "@material-ui/core/IconButton";
import * as L from 'leaflet'
import * as L1 from 'leaflet.markercluster'; // must be here!!!!,

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    map: {
        position: "fixed",
        left: props => props.open ? "calc(80% + 5px)" : "calc(97% + 5px)",
        width: "calc(20% - 5px)",
        height: "50%",
        borderRadius: 2,
        filter: props => props.open ? "none" : "brightness(20%)",
        zIndex: 3,
        top: "50%",
        margin: 0
    },
    icon: {
        padding: 0,
        backgroundColor: "#f7f7f7",
        left: props => props.open ? `calc(71% - 25px)` : `calc(88% - 25px)`,
        top: "90%",
        zIndex: 4

    }
}));

const Map = (props) => {
    const classes = useStyles(props);

    useEffect(() => {
        const map = L.map("map", { selectArea: true }).setView([53.384811, -6.263190], 13);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: "",
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoiYWxsaWV0cmFuIiwiYSI6ImNrM2Jpa3hpZjBicmwzaHA4NjljMno1YzYifQ.WRazWdYG2T1hK6H5EnKnYw'
        }).addTo(map);
        const clustersMain = new L.markerClusterGroup({
            iconCreateFunction: function (cluster) {
                return new L.DivIcon({
                    html: '<div><span>' + cluster.getChildCount() + '</span></div>',
                    className: 'marker-cluster marker-cluster-large', iconSize: new L.Point(40, 40)
                });
            },
            maxClusterRadius: 40
        });
        map.addLayer(clustersMain);
        clustersMain.on('clusterclick', function (a) {
            a.layer.zoomToBounds();
        });
    }, []);

    return (
        [<div id="map" className={classes.map} />,
        <IconButton size="small" className={classes.icon} onClick={() => props.changeStatus(!props.open)}>
            {props.open ? <KeyboardArrowRightRoundedIcon style={{ color: "#FF6584", fontSize: 50 }} /> :
                <KeyboardArrowLeftRoundedIcon style={{ color: "#FF6584", fontSize: 50 }} />}
        </IconButton>
        ]
    )
};
export default Map;