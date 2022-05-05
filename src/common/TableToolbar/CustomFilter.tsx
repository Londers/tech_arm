import React from "react";
import {FormControl, MenuItem, OutlinedInput, Select} from "@mui/material";

const SelectItems = new Map<number, string>([
    [0, 'Все привязки'],
    [1, 'Аварии 220, Выключенные УСДК'],
    [2, 'Неисправности'],
    [3, 'Неисправности GPS'],
    [4, 'Отсутствие связи'],
    [5, 'Управление из центра'],
    [6, 'Наличие связи'],
    [7, 'Режим смены фаз'],
])

export interface CustomFilterProps {
    onChange: () => void;
    value: string;
}

function CustomFilter(props: CustomFilterProps) {

    return (
        <FormControl style={{marginLeft: "5vw"}}>
            <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip-select"
                value={props.value}
                onChange={props.onChange}
                input={<OutlinedInput/>}
            >
                {
                    Array.from(SelectItems.entries()).map((([key, value]) =>
                            <MenuItem key={key} value={key}>{value}</MenuItem>
                    ))
                }
                {/*<MenuItem key={0} value="0">Стандартный</MenuItem>*/}
                {/*<MenuItem key={1} value="1">Экономный</MenuItem>*/}
            </Select>
        </FormControl>
    )
}

export default CustomFilter