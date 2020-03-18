import React, { useEffect, useState, useRef } from 'react'
import KeyboardArrowLeftRoundedIcon from '@material-ui/icons/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@material-ui/icons/KeyboardArrowRightRounded';
import IconButton from "@material-ui/core/IconButton";
import * as L from 'leaflet'
import 'leaflet.markercluster'; // must be here!!!!
import 'leaflet-polylinedecorator'
import SelectArea from 'leaflet-area-select';

import { makeStyles } from '@material-ui/core/styles';
const PRECISION = 5
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

var mainIcon = new L.Icon({
    iconUrl: 'mainicon_64.png',
    iconSize:     [64, 64], // size of the icon
    iconAnchor:   [33, 58], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });

var subIcon = new L.Icon({
    iconUrl: 'pinkicon48.png',
    iconSize:     [48, 48], // size of the icon
    iconAnchor:   [24, 42], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });


const Map = ({ open, submitRegion, scenes, selected, changeStatus }) => {
    const classes = useStyles({ open });
    const [center, setCenter] = useState(selected === null ? [53.384811, -6.263190] : selected);
    const [bounds, setBounds] = useState(null);
    const [zoom, setZoom] = useState(13);

    const submit = () => {
        submitRegion(bounds, scenes)
    };

    const map = useRef(null);
    const markerGroup = useRef(null);
    const clustersMain = useRef(null);
    const pathLine = useRef(null);
    const boundLine = useRef(null)
    const pane = useRef(null)

    useEffect(() => {
        map.current = L.map("map", { selectArea: true, maxZoom: 17 }).setView([53.384811, -6.263190], 13);
        markerGroup.current = L.layerGroup().addTo(map.current);

        map.current.on('areaselected', (e) => {
            // setCenter(map.current.getCenter());
            // setZoom(map.current._zoom);
            map.current.fitBounds(e.bounds, {minZoom : map.current._zoom});
            // map.current.setMaxBounds(e.bounds, {minZoom : map.current._zoom});
            // map.current.e.getBoundsZoom
            setBounds(e.bounds.toBBoxString().split(","));
            console.log(e.bounds.toBBoxString().split(","))
            console.log(map.current._zoom)
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
        if (scenes.length > 0) {
            let first_location = null;
            if (clustersMain.current !== null) {
                clustersMain.current.clearLayers();
            }
            clustersMain.current = new L.markerClusterGroup({
                spiderfyOnMaxZoom: false,
                maxClusterRadius: 20,
                polygonOptions: {weight: 1, opacity:0.5}
            });

            scenes.forEach((scene) => {
                if (scene.gps !== null) {
                    if (first_location === null) {
                        first_location = [scene.gps[1][0].lat.toPrecision(PRECISION), scene.gps[1][0].lon.toPrecision(PRECISION)]
                    }
                    clustersMain.current.addLayer(L.marker([scene.gps[1][0].lat.toPrecision(PRECISION),
                                                            scene.gps[1][0].lon.toPrecision(PRECISION)],
                                                            {icon: subIcon}))
                }
            })
            map.current.addLayer(clustersMain.current);
            clustersMain.current.on('clusterclick', function (a) {
                a.layer.zoomToBounds();
            });
            map.current.flyTo(first_location, 13)
        }

    }, [scenes]);

    useEffect(() => {
        if (selected !== null) {
            if (pathLine.current !== null) {
                pathLine.current.clearLayers()
            }
            else {
                if (pane.current === null) {
                    pane.current = map.current.createPane("pathPane")
                    map.current.getPane('pathPane').style.zIndex = 625;
                    map.current.getPane('pathPane').style.pointerEvents = 'none';
                }
                pathLine.current = new L.LayerGroup([])
            }

            let path = []
            for (let i = 0; i < 3; i++) {
                if (scenes[selected].gps[i] !== null) {
                    scenes[selected].gps[i].forEach(gps => {
                        path.push([gps.lat.toPrecision(PRECISION), gps.lon.toPrecision(PRECISION)])
                    });
                }
            }
            var polyline = L.polyline(path, { weight: 3, opacity: 1, pane: pane.current }).addTo(pathLine.current);
            map.current.fitBounds(polyline.getBounds());

            var arrowHead = L.polylineDecorator(polyline, {
                patterns: [
                    {
                        offset: 0, repeat: "99%",
                        symbol: L.Symbol.arrowHead({
                            pixelSize: 10,
                            polygon: false,
                            pathOptions: { stroke: true, weight: 3, opacity: 1, pane: pane.current }
                        })
                    }
                ]
            }).addTo(pathLine.current);
            var marker = L.marker([scenes[selected].gps[1][0].lat.toPrecision(PRECISION),
                                   scenes[selected].gps[1][0].lon.toPrecision(PRECISION)],
                                   {icon: mainIcon,
                                    pane: pane.current}).addTo(pathLine.current)

            // start = new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) })

            map.current.addLayer(pathLine.current)
        }
    }, [selected])

    useEffect(() => {
        // map.current.setView(center, zoom);
        if (bounds === null) {
            return
        }
        if (boundLine.current !== null) {
            map.current.removeLayer(boundLine.current)
        }
        boundLine.current = L.rectangle([[parseFloat(bounds[3]), parseFloat(bounds[0])],
        [parseFloat(bounds[1]), parseFloat(bounds[2])]],
            { color: "#ff7800", weight: 1, fill: false }).addTo(map.current);

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
