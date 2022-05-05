import React from "react";
import CustomSearch, {CustomSearchProps} from "./CustomSearch";
import CustomFilter, {CustomFilterProps} from "./CustomFilter";

interface CustomTableToolbarProps {
    search: CustomSearchProps,
    filter: CustomFilterProps,
}

function CustomTableToolbar(props: CustomTableToolbarProps) {
    return (
        <div style={{display: "flex"}}>
            <CustomSearch clearSearch={props.search.clearSearch}
                          onChange={props.search.onChange}
                          value={props.search.value}/>
            <CustomFilter onChange={props.filter.onChange}
                          value={props.filter.value}/>
        </div>
    )
}

export default CustomTableToolbar