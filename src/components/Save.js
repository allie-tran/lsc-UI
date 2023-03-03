import React, { useEffect, memo, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import Typography from '@material-ui/core/Typography';
import Thumbnail from './Thumbnail';
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";

import BookmarkRoundedIcon from '@material-ui/icons/BookmarkRounded';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import Badge from "@material-ui/core/Badge"
import {submitAll} from "../redux/actions/submit";
import { clearSaved } from "../redux/actions/save";
import useSound from "use-sound";
import sfxSound from "../navigation_transition-right.wav";
import * as d3 from 'd3';
import {saveSvgAsPng} from "save-svg-as-png"

const useStyles = makeStyles((theme) => ({
    section: {
        position: "fixed",
        left: (props) => (props.open ? "75%" : "97%"),
        width: "25%",
        height: "calc(100% - 60px)",
        filter: (props) => (props.open ? "none" : "brightness(70%)"),
        zIndex: 3,
        top: "calc(0% + 60px)",
        margin: 0,
        backgroundColor: "#272727",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    title: {
        padding: 10,
        color: "#CCCCCC",
        display: "flex",
        justifyContent: "space-around"
    },
    divider: {
        color: "#CCCCCC",
    },
    icon: {
        position: "relative",
        top: 6,
        marginLeft: 5,
        color: "#FF6584",
    },
    imageContainer: {
        width: "100%",
        maxHeight: "95%",
        overflow: "scroll",
        height: "95%",
        display: "flex",
        flexDirection: "column"
    },
    list: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "center",
        height: "100%",
        paddingTop: "5%",
        // flexWrap: "wrap-reverse"
        overflowX: "scroll",
    },
    button: {
        height: 16,
        padding: 0,
    },
}));


var isEqual = require('lodash.isequal');

const areEqual = (prev, next) => {
    return isEqual(prev.saved, next.saved);
    return isEqual(prev.data, next.data);
}

const useD3 = (renderChartFn, dependencies) => {
    const ref = useRef();

    useEffect(() => {
        console.log(dependencies);
        renderChartFn(d3.select(ref.current));
        return () => {};
      }, dependencies);
    return ref;
}


const SaveSection = memo(({ open, openEvent, fixedWidth, fixedHeight}) => {
    const [play] = useSound(sfxSound);
	const classes = useStyles({ open });
    const saved = useSelector(state => state.save.saved, isEqual)
    const aggs = useSelector(state => state.search.aggs, isEqual)
    const ref = useD3(
    (svg) => {
        if (aggs){
            const data = aggs.people.buckets

            const height = fixedHeight * 24/100;
            const width = fixedWidth * 30/100;
            const margin = { top: 20, right: fixedWidth * 7/100, bottom: 50, left: 40 };

            const x = d3
                .scaleBand()
                .domain(data.map((d) => d.key))
                .rangeRound([margin.left, width - margin.right])
                .padding(0.1);

            const y1 = d3
                .scaleLinear()
                .domain([0, d3.max(data, (d) => d.doc_count)])
                .rangeRound([height - margin.bottom, margin.top]);

            const xAxis = (g) =>
                g
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .style("color", "#ccc")
                .call(d3
                    .axisBottom(x)
                    .tickValues(
                    x.domain()
                    )
                    .tickSizeOuter(0)
                ).selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", "-0.5em")
                .attr("transform", "rotate(-90)")
                .attr("fill", "currentColor")

            const y1Axis = (g) =>
                g
                .attr("transform", `translate(${margin.left},0)`)
                .style("color", "#605c9b")
                .call(d3.axisLeft(y1).ticks(null, "s"))
                .call((g) => g.select(".domain").remove())
                .call((g) =>
                    g
                    .append("text")
                    .attr("x", -margin.left)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text(data.y1)
                );

            svg.select(".x-axis_people").call(xAxis);
            svg.select(".y-axis_people").call(y1Axis);

            svg
                .select(".plot-area_people")
                .attr("fill", "#605c9b")
                .selectAll(".bar")
                .data(data)
                .join("rect")
                .attr("class", "bar")
                .attr("x", (d) => x(d.key))
                .attr("width", x.bandwidth())
                .attr("y", (d) => y1(d.doc_count))
                .attr("height", (d) => y1(0) - y1(d.doc_count));
                }}
        ,
        [aggs]
    );

    const Download = useCallback(
        (key) => {
            if (aggs){
                if (key == "graph"){
                    saveSvgAsPng(ref.current, "people.png");
                    saveSvgAsPng(date.current, "visit.png");
                    saveSvgAsPng(noon.current, "noon.png");
                    return;
                }
                let data = aggs[key].buckets;
                var headers;
                var csvContent;
                if (key == "people"){
                    headers = [key, "count"]
                    let rows = data.map((d) => [d.key, d.doc_count])
                    csvContent = "data:text/csv;charset=utf-8,"
                        + headers.join(",") + "\n"
                        + rows.map(e => e.join(",")).join("\n");
                }
                else {
                    if (key == "full"){
                        headers = ["people", "visit", "date", "before noon", "count"]
                    }
                    else {
                        headers = ["people", "visit", "count"]
                    }

                    let rows = data.map((d) => [...d.key, d.doc_count])
                    csvContent = "data:text/csv;charset=utf-8,"
                        + headers.join(",") + "\n"
                        + rows.map(e => e.join(",")).join("\n");
                }
                var encodedUri = encodeURI(csvContent);
                var link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", key + ".csv");
                document.body.appendChild(link); // Required for FF
                link.click();
            }
        },
        [aggs]
    )

    const date = useD3(
    (svg) => {
        if (aggs){
            const data = aggs.visit.buckets.slice(0, 10)

            const height = fixedHeight * 24/100;
            const width = fixedWidth * 30/100;
            const margin = { top: 20, right: fixedWidth * 7/100, bottom: 50, left: 40 };

            const x = d3
                .scaleBand()
                .domain(data.map((d) => d.key))
                .rangeRound([margin.left, width - margin.right])
                .padding(0.1);

            const y1 = d3
                .scaleLinear()
                .domain([0, d3.max(data, (d) => d.doc_count)])
                .rangeRound([height - margin.bottom, margin.top]);

            const xAxis = (g) =>
                g
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .style("color", "#ccc")
                .call(d3
                    .axisBottom(x)
                    .tickValues(
                    x.domain()
                    )
                    .tickSizeOuter(0)
                ).selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", "-0.5em")
                .attr("transform", "rotate(-90)")
                .attr("fill", "currentColor")

            const y1Axis = (g) =>
                g
                .attr("transform", `translate(${margin.left},0)`)
                .style("color", "#a25563")
                .call(d3.axisLeft(y1).ticks(null, "s"))
                .call((g) => g.select(".domain").remove())
                .call((g) =>
                    g
                    .append("text")
                    .attr("x", -margin.left)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text(data.y1)
                );

            svg.select(".x-axis_day").call(xAxis);
            svg.select(".y-axis_day").call(y1Axis);

            svg
                .select(".plot-area_day")
                .attr("fill", "#a25563")
                .selectAll(".bar")
                .data(data)
                .join("rect")
                .attr("class", "bar")
                .attr("x", (d) => x(d.key))
                .attr("width", x.bandwidth())
                .attr("y", (d) => y1(d.doc_count))
                .attr("height", (d) => y1(0) - y1(d.doc_count));
                }}
        ,
        [aggs]
    );


    const noon = useD3(
    (svg) => {
        if (aggs){
            const data = aggs.noon.buckets.slice(0, 10)

            const height = fixedHeight * 24/100;
            const width = fixedWidth * 30/100;
            const margin = { top: 20, right: fixedWidth * 7/100, bottom: 50, left: 40 };

            const x = d3
                .scaleBand()
                .domain(data.map((d) => d.key? "Before 12pm": "After 12pm"))
                .rangeRound([margin.left, width - margin.right])
                .padding(0.1);

            const y1 = d3
                .scaleLinear()
                .domain([0, d3.max(data, (d) => d.doc_count)])
                .rangeRound([height - margin.bottom, margin.top]);

            const xAxis = (g) =>
                g
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .style("color", "#ccc")
                .call(d3
                    .axisBottom(x)
                    .tickValues(
                    x.domain()
                    )
                    .tickSizeOuter(0)
                ).selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", "-0.5em")
                .attr("transform", "rotate(-90)")
                .attr("fill", "currentColor")

            const y1Axis = (g) =>
                g
                .attr("transform", `translate(${margin.left},0)`)
                .style("color", "#738d67")
                .call(d3.axisLeft(y1).ticks(null, "s"))
                .call((g) => g.select(".domain").remove())
                .call((g) =>
                    g
                    .append("text")
                    .attr("x", -margin.left)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text(data.y1)
                );

            svg.select(".x-axis_noon").call(xAxis);
            svg.select(".y-axis_noon").call(y1Axis);

            svg
                .select(".plot-area_noon")
                .attr("fill", "#738d67")
                .selectAll(".bar")
                .data(data)
                .join("rect")
                .attr("class", "bar")
                .attr("x", (d) => x(d.key? "Before 12pm": "After 12pm"))
                .attr("width", x.bandwidth())
                .attr("y", (d) => y1(d.doc_count))
                .attr("height", (d) => y1(0) - y1(d.doc_count));
                }}
        ,
        [aggs]
    );

    const dispatch = useDispatch();
	useEffect(
		() => {
			var section = document.getElementById('save-section');
			section.scrollTop = 0;
		},
		[ saved ]
	);
	return (
        <div id="save" className={classes.section}>
            <Typography variant="subtitle1" className={classes.title}>
                ANALYSIS
                <Badge badgeContent={saved.length} color="primary">
                    <BookmarkRoundedIcon />
                </Badge>
            </Typography>
            <Typography className={classes.title}>
                To access the full data, click Download.
            </Typography>
            <div classname={classes.title}>
                    <Button
                        className={classes.button}
                        onClick={() => Download("full")}>
                            {" "}
                                    Download CSV{" "}
                                    <Badge badgeContent={saved.length} color="primary">
                            <FileDownloadIcon />
                        </Badge>
                    </Button>
                    <Button
                        className={classes.button}
                        onClick={() => Download("graph")}>
                            {" "}
                                    Download Graphs{" "}
                                    <Badge badgeContent={saved.length} color="primary">
                            <FileDownloadIcon />
                        </Badge>
                    </Button>
            </div>
            <div className={classes.imageContainer} id="save-section">
                <svg
                    ref={ref}
                    style={{
                        height: "32%",
                        width: "100%",
                        marginRight: "0px",
                        marginLeft: "0px",
                        overflow: "scroll",
                    }}
                    >
                    <g className="plot-area_people" />
                    <g className="x-axis_people" />
                    <g className="y-axis_people" />
                </svg>

                {/* <Button
                className={classes.button}
                onClick={() => Download("date")}>
                    {" "}
                            Date CSV{" "}
                            <Badge badgeContent={saved.length} color="primary">
                    <FileDownloadIcon />
                </Badge>
                </Button> */}

                <svg
                    ref={date}
                    style={{
                        height: "32%",
                        width: "100%",
                        marginRight: "0px",
                        marginLeft: "0px",
                        overflow: "scroll",
                    }}
                    >
                    <g className="plot-area_day" />
                    <g className="x-axis_day" />
                    <g className="y-axis_day" />
                </svg>

                <svg
                    ref={noon}
                    style={{
                        height: "32%",
                        width: "100%",
                        marginRight: "0px",
                        marginLeft: "0px",
                        overflow: "scroll",
                    }}
                    >
                    <g className="plot-area_noon" />
                    <g className="x-axis_noon" />
                    <g className="y-axis_noon" />
                </svg>
            </div>
        </div>
    );
	// 	);
	// } else {
	// 	return (
	// 		<div id="save" className={classes.section}>
	// 			<Typography variant="subtitle1" className={classes.title}>
	// 				SAVED SCENES
	// 				<Badge badgeContent={saved.length} color="primary">
	// 					<BookmarkRoundedIcon />
	// 				</Badge>
	// 			</Typography>

	// 		</div>
	// 	);
	// }
}, areEqual);

SaveSection.whyDidYouRender=true

export default SaveSection;
