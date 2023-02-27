import React, { memo } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import commonPlace from "../commonplace";
import regions from "../regions";

import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
// import { alpha, styled } from "@mui/material/styles";
// import { useAutocomplete } from "@mui/base/AutocompleteUnstyled";

var topPlaces = [];
var already = [];
commonPlace.forEach((item) => {
    if (!already.includes(item[0])) {
        already.push(item[0]);
        topPlaces.push({ label: item[0], category: 'Location' });
    }
});

regions.forEach((item) => {
    if (!already.includes(item)) {
        already.push(item);
        topPlaces.push({ label: item, category: 'Region' });
    }
});


const areEqual = (prevProps, nextProps) => {
    return prevProps.className === nextProps.className;
};

const ComboBox = () => {
    return (
        <Autocomplete
              multiple
            //   disableCloseOnSelect
            //   limitTags={2}
            options={topPlaces}
            groupBy={(option) => option.category}
            getOptionLabel={(option) => option.label}
            size="small"
            autoComplete
            id="tags-outlined"
            sx={{
                width: "calc(20% - 10px)",
                top: 60,
                right: 0,
                position: "fixed",
                zIndex: 3,
                backgroundColor: "#ffffff",
                border: "5px solid #272727",
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="filled"
                    label="All Locations & Regions"
                    placeholder="Try some location name..."
                />
            )}
            renderOption={(props, option, { inputValue }) => {
                const matches = match(option.label, inputValue);
                const parts = parse(option.label, matches);
                return (
                    <li {...props}>
                        <div>
                            {parts.map((part, index) => (
                                <span
                                    key={index}
                                    style={{
                                        fontWeight: part.highlight ? 700 : 400,
                                    }}
                                >
                                    {part.text}
                                </span>
                            ))}
                        </div>
                    </li>
                );
            }}
        />
    );
};

ComboBox.whyDidYouRender = true;
export default memo(ComboBox, areEqual);
