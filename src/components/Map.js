import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GpsOffRoundedIcon from '@material-ui/icons/GpsOffRounded';
import GpsFixedRoundedIcon from '@material-ui/icons/GpsFixedRounded';
import IconButton from '@material-ui/core/IconButton';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-polylinedecorator';
import 'leaflet-area-select';
import "@geoapify/leaflet-address-search-plugin";

import { makeStyles } from '@material-ui/core/styles';
import { setQueryBound } from '../redux/actions/search';
// import worldmap from '../worldmap'
import commonPlace from '../commonplace'
import ENV from "./env.json"

var isEqual = require('lodash.isequal');

const PRECISION = 5;
const useStyles = makeStyles((theme) => ({
	map: {
		position: 'fixed',
		left: (props) => (props.open ? '80%' : 'calc(97% + 5px)'),
		width: '30%',
		height: 'calc(70% - 60px)',
        paddingLeft: 10,
		borderRadius: 2,
		filter: (props) => (props.open ? 'none' : 'brightness(25%)'),
		zIndex: 3,
		top: 115,
		margin: 0,
        border: "5px solid #272727",
	},
	icon: {
		padding: 0,
		backgroundColor: '#f7f7f7',
		right: "0.5%",
		top: 'calc(100px + 0.5%)',
        position: "fixed",
		zIndex: 4
	},
	insideIcon: {
		color: '#272727',
		fontSize: 36
	}
}));

var mainIcon = new L.Icon({
	iconUrl: 'mainicon_64.png',
	iconSize: [ 64, 64 ], // size of the icon
	iconAnchor: [ 32, 55 ], // point of the icon which will correspond to marker's location
	popupAnchor: [ 0, 0 ] // point from which the popup should open relative to the iconAnchor
});

var subIcon = L.Icon.extend({
	options: {
		iconUrl: 'pinkicon48.png',
		iconSize: [ 48, 48 ], // size of the icon
		iconAnchor: [ 24, 42 ], // point of the icon which will correspond to marker's location
		popupAnchor: [ 0, 0 ] // point from which the popup should open relative to the iconAnchor
	}
});

var cancelIcon = L.Icon.extend({
	options: {
		iconUrl: 'Cancel-16.png',
		iconSize: [ 16, 16 ], // size of the icon
		iconAnchor: [ 8, 8 ], // point of the icon which will correspond to marker's location
		popupAnchor: [ 0, 0 ] // point from which the popup should open relative to the iconAnchor
	}
});


const Map = ({ open }) => {
  const classes = useStyles({ open });
  const [status, setStatus] = useState(true);
  const dispatch = useDispatch();
  const stateBounds = useSelector((state) => state.search.bounds);
  const visualisation = useSelector((state) => state.search.info);

  const dates = useSelector((state) => state.search.dates, isEqual);
  // const selected = useSelector((state) => state.select.selected);
  const gpsResponse = useSelector((state) => state.search.gpsResponse);

  const map = useRef(null);
  const clustersMain = useRef(null);
  const pathLine = useRef(null);
  const boundLine = useRef(null);
  const pane = useRef(null);
  const namePane = useRef(null);
  const nameLayer = useRef(null);
  const marker = useRef(null);

  const style = (geoJsonFeature) => {
    return {
      fillColor: "#FF6584",
      fillOpacity: 0.15,
      color: "white",
      weight: 1,
    };
  };

  const addLocation = (name, latlon) => {
    L.circleMarker(latlon, {
      radius: 10,
      weight: 2,
      title: name,
      zIndexOffset: 200,
      color: "#6C63FF",
      pane: namePane.current,
    }).addTo(nameLayer.current);
    L.marker(latlon, {
      icon: L.divIcon({
        html: "<b>" + name + "</b>",
        className: "text-below-marker",
      }),
      pane: namePane.current,
      zIndexOffset: 201,
    }).addTo(nameLayer.current);
  };

  // Add Geoapify Address Search control
  const addressSearchControl = L.control.addressSearch(ENV["API_KEY"], {
        position: "bottomleft",
        className: "autocomplete",
        resultCallback: (address) => {
          if (marker.current) {
            marker.current.remove();
          }

          if (!address) {
            return;
          }

          marker.current = L.marker([address.lat, address.lon]).addTo(
            map.current
          );
          if (
            address.bbox &&
            address.bbox.lat1 !== address.bbox.lat2 &&
            address.bbox.lon1 !== address.bbox.lon2
          ) {
            map.current.fitBounds(
              [
                [address.bbox.lat1, address.bbox.lon1],
                [address.bbox.lat2, address.bbox.lon2],
              ],
              { padding: [100, 100] }
            );
          } else {
            map.current.setView([address.lat, address.lon], 15);
          }
        },
        suggestionsCallback: (suggestions) => {
          console.log(suggestions);
        },
      })

  useEffect(() => {
    if (map.current) {
      return;
    }
    map.current = L.map("map", { selectArea: true, maxZoom: 17 }).setView(
      [53.384811, -6.26319],
      13
    );
    map.current.on("areaselected", (e) => {
      map.current.fitBounds(e.bounds, { minZoom: map.current._zoom });
      dispatch(setQueryBound(e.bounds.toBBoxString().split(",")));
    });

    // L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
    //   maxZoom: 18,
    //   attribution:
    //     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    // }).addTo(map.current);

    var mapURL = L.Browser.retina
      ? `https://maps.geoapify.com/v1/tile/{mapStyle}/{z}/{x}/{y}.png?apiKey={apiKey}`
      : `https://maps.geoapify.com/v1/tile/{mapStyle}/{z}/{x}/{y}@2x.png?apiKey={apiKey}`;

    L.tileLayer(mapURL, {
      attribution:
        "Powered by Geoapify | © OpenMapTiles © OpenStreetMap contributors",
      apiKey: ENV["API_KEY"],
      mapStyle: "osm-bright-smooth", // More map styles on https://apidocs.geoapify.com/docs/maps/map-tiles/
      maxZoom: 20,
    }).addTo(map.current);

    // L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    // 	maxZoom: 18,
    // 	attribution:
    // 		'&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    // }).addTo(map.current);

    pane.current = map.current.createPane("pathPane");
    map.current.getPane("pathPane").style.zIndex = 625;
    map.current.getPane("pathPane").style.pointerEvents = "none";
    namePane.current = map.current.createPane("namePane");
    map.current.getPane("namePane").style.zIndex = 600;
    map.current.getPane("namePane").style.pointerEvents = "none";
    pathLine.current = new L.LayerGroup([]);
    boundLine.current = new L.LayerGroup([]);
    nameLayer.current = new L.LayerGroup([]);

    // addLocation("Home", [53.3891, -6.1582])
    // addLocation("Work", [53.385620932388115, -6.257628756040199])
    // // addLocation("The Helix", [53.38619606558428, -6.258864863835501])
    // addLocation("Science Gallery Café ", [53.344411213087845, -6.251248623461222])
    // addLocation("Clarion Hotel The Edge", [69.6475272599796, 18.95679219883619])

    clustersMain.current = new L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      maxClusterRadius: 80,
      polygonOsptions: { weight: 1, opacity: 0.5 },
      animate: true,
      animateAddingMarkers: true,
      singleMarkerMode: true,
    });

    // map.current.addControl(addressSearchControl);
    L.control.zoom({ position: "bottomright" }).addTo(map.current);
  }, [addressSearchControl]);

  useEffect(
    () => {
      if (status && dates.length > 0) {
        if (clustersMain.current) {
          clustersMain.current.clearLayers();
        }
        if (visualisation) {
          visualisation.place_to_visualise.forEach((name, id) => {
            let count = 0;
            commonPlace.forEach((place) => {
              if (name === place[0]) {
                count += 1;
                if (count < 5) {
                    addLocation(name, [
                      place[1][0].toPrecision(PRECISION),
                      place[1][1].toPrecision(PRECISION),
                    ]);
                }
              }
            });
          });

          visualisation.country_to_visualise.forEach(({ country, geojson }) => {
            console.log(country);
            L.geoJson(geojson, { style: style }).addTo(nameLayer.current);
            // import("../worldmap")
            // .then(({ worldmap }) => {
            // L.geoJson(worldmap[name], {style: style}).addTo(nameLayer.current);
            // })
            // .catch((err) => {
            // console.log("Can't load worldmap");
            // });
          });
        }
        dates.forEach((scene, id) => {
          if (scene && scene.gps) {
            var marker = L.marker(
              [
                scene.gps[0].lat.toPrecision(PRECISION),
                scene.gps[0].lon.toPrecision(PRECISION),
              ],
              {
                icon: new subIcon({ index: id }),
                attribution: id,
              }
            );
            clustersMain.current.addLayer(marker);
          }
        });
        map.current.addLayer(clustersMain.current);
        map.current.addLayer(nameLayer.current);
        map.current.fitBounds(clustersMain.current.getBounds());
      }
      return () => {
        clustersMain.current.clearLayers();
        nameLayer.current.clearLayers();
        pathLine.current.clearLayers();
      };
    }, // eslint-disable-next-line
    [dates, status, visualisation]
  );

  useEffect(
    () => {
      if (gpsResponse) {
        pathLine.current.clearLayers();
        gpsResponse.then((res) => {
          var gps = res.data.gps;
          var location = res.data.location;
          if (status && gps) {
            var marker = L.marker(
              [gps.lat.toPrecision(PRECISION), gps.lon.toPrecision(PRECISION)],
              {
                icon: mainIcon,
                pane: pane.current,
                interactive: false,
              }
            ).addTo(pathLine.current);

            L.marker(
              [gps.lat.toPrecision(PRECISION), gps.lon.toPrecision(PRECISION)],
              {
                icon: L.divIcon({
                  html: "<b>" + location + "</b>",
                  className: "text-below-marker",
                }),
                pane: pane.current,
                zIndexOffset: 1001,
              }
            ).addTo(pathLine.current);

            // Zooming
            map.current.setView(marker.getLatLng(), 13);
            // map.current.setView(marker.getLatLng());
            map.current.addLayer(pathLine.current);
          }
        });
      }

      return () => pathLine.current.clearLayers();
    }, // eslint-disable-next-line
    [gpsResponse, status]
  );

  useEffect(() => {
    boundLine.current.clearLayers();
    // map.current.setView(center, zoom);
    if (status && stateBounds) {
      var latlngBounds = L.latLngBounds(
        [parseFloat(stateBounds[3]), parseFloat(stateBounds[0])],
        [parseFloat(stateBounds[1]), parseFloat(stateBounds[2])]
      );
      L.rectangle(latlngBounds, {
        color: "#ff7800",
        weight: 1,
        fill: false,
      }).addTo(boundLine.current);
      var marker = L.marker(latlngBounds.getSouthEast(), {
        icon: new cancelIcon(),
      }).addTo(boundLine.current);
      marker.on("click", (e) => dispatch(setQueryBound(null)));
      map.current.addLayer(boundLine.current);
    } else if (boundLine.current) {
      boundLine.current.clearLayers();
    }
  }, [stateBounds, status]);

  return [
    <div key="map" id="map" className={classes.map} />,
    <IconButton
      key="icon"
      size="small"
      className={classes.icon}
      onClick={() => setStatus(!status)}
    >
      {status ? (
        <GpsFixedRoundedIcon className={classes.insideIcon} />
      ) : (
        <GpsOffRoundedIcon className={classes.insideIcon} />
      )}
    </IconButton>,
  ];
};

export default Map;
