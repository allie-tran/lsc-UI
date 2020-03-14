import React, { useEffect, useState, useRef } from 'react'
import KeyboardArrowLeftRoundedIcon from '@material-ui/icons/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@material-ui/icons/KeyboardArrowRightRounded';
import IconButton from "@material-ui/core/IconButton";
import * as L from 'leaflet'
import * as L1 from 'leaflet.markercluster'; // must be here!!!!

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

const Map = ({ open, submitRegion, scenes, location, changeStatus }) => {
    const classes = useStyles({ open });
    const [center, setCenter] = useState(location === null ? [53.384811, -6.263190] : location);
    const [bounds, setBounds] = useState(null);
    const [zoom, setZoom] = useState(13);

    const submit = () => {
        submitRegion(bounds, scenes)
    };

    const map = useRef(null);
    const markerGroup = useRef(null);
    const clustersMain = useRef(null);

    useEffect(() => {
        map.current = L.map("map", { selectArea: true }).setView([53.384811, -6.263190], 13);
        markerGroup.current = L.layerGroup().addTo(map.current);

        map.current.on('areaselected', (e) => {
            window.scrollTo(0, 0);
            setCenter(map.current.getCenter());
            setZoom(map.current._zoom);
            setBounds(e.bounds.toBBoxString().split(","));
        });

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: "",
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoiYWxsaWV0cmFuIiwiYSI6ImNrM2Jpa3hpZjBicmwzaHA4NjljMno1YzYifQ.WRazWdYG2T1hK6H5EnKnYw'
        }).addTo(map.current);
    }, []);

    useEffect(() => {
        markerGroup.current.clearLayers();
        if (location !== null) {
            map.current.setView(location, 13);
            L.marker(location).addTo(markerGroup.current);
        }
        if (scenes.length > 0) {
            let first_location = null;
            if (clustersMain.current !== null) {
                clustersMain.current.clearLayers();
            }
            clustersMain.current = new L.markerClusterGroup({
                iconCreateFunction: function (cluster) {
                    return new L.DivIcon({
                        html: '<div><span>' + cluster.getChildCount() + '</span></div>',
                        className: 'marker-cluster marker-cluster-large', iconSize: new L.Point(40, 40)
                    });
                },
                maxClusterRadius: 40
            });

            scenes.forEach((scene) => {
                if (scene.gps !== null) {
                    if (first_location === null) {
                        first_location = scene.gps[1]
                    }
                    clustersMain.current.addLayer(L.marker(scene.gps[1]))
                }
            })
            map.current.addLayer(clustersMain.current);
            clustersMain.current.on('clusterclick', function (a) {
                a.layer.zoomToBounds();
            });
        }
    }, [scenes, location]);

    useEffect(() => {
        map.current.setView(center, zoom);
        if (bounds === null) {
            return
        }
        L.rectangle([[parseFloat(bounds[3]), parseFloat(bounds[0])],
        [parseFloat(bounds[1]), parseFloat(bounds[2])]],
            { color: "#ff7800", weight: 1, fill: false }).addTo(markerGroup.current);
    }, [bounds]);


    return (
        [<div id="map" className={classes.map} />,
        <IconButton size="small" className={classes.icon} onClick={() => changeStatus(!open)}>
            {open ? <KeyboardArrowRightRoundedIcon style={{ color: "#FF6584", fontSize: 50 }} /> :
                <KeyboardArrowLeftRoundedIcon style={{ color: "#FF6584", fontSize: 50 }} />}
        </IconButton>
        ]
    )
};
export default Map;