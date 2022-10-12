import React, {ChangeEvent, useCallback, useEffect, useState} from "react";
import {useAppSelector} from "../app/hooks";
import {selectCrosses, selectDevices} from "./mainSlice";
import {DataGrid, GridColDef, GridRenderCellParams, GridSelectionModel, ruRU,} from "@mui/x-data-grid";
import {CrossInfo, Device, TableRow} from "../common";
import {createTheme, SelectChangeEvent, ThemeProvider} from "@mui/material";
import "./TopTable.sass"
import {
    checkError,
    checkGPS, checkMalfunction, checkTimeDiff, filterTable,
    prettyTraffic,
    switchArrayType,
    switchArrayTypeFromDevice,
    timeFormat
} from "../common/Tools";
import {escapeRegExp} from "../common/TableToolbar/CustomSearch";
import CustomTableToolbar from "../common/TableToolbar/CustomTableToolbar";

const theme = createTheme(
    {
        palette: {
            primary: {main: "#1976d2"},
        },
    },
    ruRU,
);

const columns: GridColDef[] = [
    {
        field: "area",
        headerName: "Район",
        flex: 1.6,
    },
    {
        field: "subarea",
        headerName: "Подрайон",
        flex: 2,
    },
    {
        field: "usdk",
        headerName: "УСДК",
        flex: 1.55,
    },
    {
        field: "sv",
        headerName: "Св",
        flex: 1.3,
        valueGetter: ((params: GridRenderCellParams<TableRow["sv"]>) => params.value?.sv),
        renderCell: (params: GridRenderCellParams<TableRow["sv"]>) => (
            <div style={{
                backgroundColor: params.row.sv?.sfdk ? "lightblue" : "",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                {params.value}
            </div>
        ),
    },
    {
        field: "type",
        headerName: "Тип",
        flex: 1.35,
        valueGetter: ((params: GridRenderCellParams<TableRow["type"]>) => params.value?.type),
        renderCell: (params: GridRenderCellParams<TableRow["type"]>) => (
            <div style={{
                backgroundColor: params.row.type?.error ? "red" : "",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                {params.value}
            </div>
        ),
    },
    {
        field: "exTime",
        headerName: "Время обмена",
        flex: 2.5,
        valueGetter: ((params: GridRenderCellParams<TableRow["exTime"]>) => params.value?.time),
        renderCell: (params: GridRenderCellParams<TableRow["exTime"]>) => (
            <div style={{
                backgroundColor: params.row.exTime?.error ? "red" : "",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                {params.value}
            </div>
        ),
    },
    {
        field: "malfDk",
        headerName: "Состояние ДК",
        flex: 3,
        cellClassName: "table-cell-wrap",
    },
    {
        field: "gps",
        headerName: "GPS",
        flex: 2.75,
    },
    {
        field: "addData",
        headerName: "Доп. данные",
        flex: 5,
        cellClassName: "table-cell-wrap",
    },
    {
        field: "traffic",
        headerName: "Трафик",
        flex: 1.75,
        renderCell: (params: GridRenderCellParams<TableRow["traffic"]>) => (
            <div style={{
                backgroundColor:
                    (Number(params.row.traffic.split(".")[0]) >= 100) || Number(params.row.traffic.split("/")[1]?.split(".")[0]) >= 100
                        ? "red" : "",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                {params.value}
            </div>
        ),
    },
    {
        field: "place",
        headerName: "Место размещения",
        flex: 5,
        cellClassName: "table-cell-wrap",
    },
    {field: "status", hide: true, hideable: false},
    {field: "idevice", hide: true, hideable: false},
];

function TopTable(props: { setSelected: Function }) {
    const crosses = useAppSelector(selectCrosses)
    const devices = useAppSelector(selectDevices)

    const convertToRow = (id: number, cross: CrossInfo, device: Device | undefined): TableRow => {
        return {
            id,
            area: cross.area,
            subarea: cross.subarea,
            usdk: cross.id,
            sv: device ? {
                    sv: (device.scon ? (device.Status.ethernet ? "L" : "+") : ""),
                    sfdk: device.StatusCommandDU.IsReqSFDK1
                } :
                {sv: "", sfdk: false},
            type: device ?
                {
                    type: switchArrayTypeFromDevice(device.Model),
                    error: switchArrayTypeFromDevice(device.Model) !== switchArrayType(cross.arrayType)
                } :
                {
                    type: switchArrayType(cross.arrayType),
                    error: false
                },
            exTime: device ?
                {
                    time: timeFormat(device.ltime),
                    error: checkTimeDiff(device)
                } :
                {time: "", error: false},
            malfDk: cross.status,
            gps: device ? checkGPS(device.GPS) : "",
            addData: device ? checkError(device, checkMalfunction(device.Error) !== "") : "",
            traffic: device ? prettyTraffic(device.Traffic.FromDevice1Hour) + "/" + prettyTraffic(device.Traffic.LastFromDevice1Hour) : "",
            place: cross.describe,
            status: cross.statuscode,
            idevice: cross.idevice
        }
    }

    const [selection, setSelection] = useState<number>(0)
    const handleCrossSelect = (selected: GridSelectionModel) => {
        if (filteredRows.length > 0) {
            const idevice = filteredRows.find(row => row.id === selected[0])?.idevice ?? 0
            setSelection(Number(selected[0]) ?? 0)
            props.setSelected(idevice)
        }
    }

    const [searchText, setSearchText] = React.useState<string>("")
    const [filter, setFilter] = React.useState<number>(0)

    const generateData = useCallback(() => {
        const initialState: TableRow[] = []
        crosses.forEach((cross, id) => {
            const device = devices.find(dev => dev.device.id === cross.idevice)?.device
            initialState.push(convertToRow(id, cross, device))
        })
        return filterTable(devices, initialState, filter) ?? []
    }, [crosses, devices, filter])

    const [rows, setRows] = useState<TableRow[]>(generateData())
    const [filteredRows, setFilteredRows] = useState<TableRow[]>(generateData())

    const requestSearch = useCallback((searchValue: string) => {
        setSearchText(searchValue)
        const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
        const filteredRows = rows.filter((row: any) => {
            return Object.keys(row).some((field: any) => {
                if (typeof row[field] === "object") {
                    return searchRegex.test(Object.values(row[field]).find(value => typeof value === "string") as string)
                } else {
                    return searchRegex.test(row[field].toString())
                }
            })
        })
        setFilteredRows(filteredRows)
        if (filteredRows.length > 0) handleCrossSelect([filteredRows.find(row => row.id === selection)?.id ?? filteredRows[0]?.id])
    }, [rows])

    useEffect(() => {
        setRows(generateData())
    }, [generateData]);

    useEffect(() => {
        requestSearch(searchText)
    }, [requestSearch, searchText]);

    const handleFilterChange = (event: SelectChangeEvent<number>) => {
        const newFilter = Number(event.target.value)
        setFilter(newFilter)
        setRows(filterTable(devices, rows, newFilter) ?? [])
        if (filteredRows.length > 0) handleCrossSelect([filteredRows.find(row => row.id === selection)?.id ?? filteredRows[0]?.id])
    }

    return (
        <div style={{height: "60vh", width: "100%"}}>
            <ThemeProvider theme={theme}>
                <DataGrid
                    components={{
                        Toolbar: CustomTableToolbar,
                    }}
                    rows={filteredRows}
                    columns={columns}
                    // selectionModel={selection}
                    onSelectionModelChange={handleCrossSelect}
                    hideFooter
                    componentsProps={{
                        toolbar: {
                            search: {
                                value: searchText,
                                onChange: (event: ChangeEvent<HTMLInputElement>) => requestSearch(event.target.value),
                                clearSearch: () => requestSearch(""),
                            },
                            filter: {
                                value: filter,
                                onChange: handleFilterChange,
                            }
                        },
                    }}
                />
            </ThemeProvider>
        </div>
    )
}

export default TopTable