import React, {useCallback, useEffect, useState} from "react";
import {useAppSelector} from "../app/hooks";
import {selectCrosses, selectDevices} from "./mainSlice";
import {DataGrid, GridColDef, GridRenderCellParams, GridSelectionModel, ruRU,} from "@mui/x-data-grid";
import {CrossInfo, Device, TableRow} from "../common";
import {createTheme, ThemeProvider} from "@mui/material";
import "./TopTable.sass"
import {
    checkError,
    checkGPS, checkTimeDiff, maxTimeDifference,
    prettyTraffic,
    switchArrayType,
    switchArrayTypeFromDevice,
    timeFormat
} from "../common/Tools";

const theme = createTheme(
    {
        palette: {
            primary: {main: "#1976d2"},
        },
    },
    ruRU,
);

//Желтое мигание из-за перегорания контролируемых красных ламп
const columns: GridColDef[] = [
    // {field: "state", headerName: "", width: 50},
    {
        field: "area",
        headerName: "Район",
        // headerAlign: "center",
        flex: 1,
        // cellClassName: "table-cell",
    },
    {
        field: "subarea",
        headerName: "Подрайон",
        // headerAlign: "center",
        flex: 1.5,
        // cellClassName: "table-cell",
    },
    {
        field: "usdk",
        headerName: "УСДК",
        // headerAlign: "center",
        flex: 1,
        // cellClassName: "table-cell",
    },
    {
        field: "sv",
        headerName: "Св",
        // headerAlign: "center",
        flex: 0.75,
        // cellClassName: "table-cell",
        renderCell: (params: GridRenderCellParams<TableRow["sv"]>) => (
            <div style={{
                backgroundColor: params.value?.sfdk ? "lightblue" : "",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                {params.value?.sv}
            </div>
        ),
    },
    {
        field: "type",
        headerName: "Тип",
        // headerAlign: "center",
        flex: 1,
        // cellClassName: "table-cell",
        renderCell: (params: GridRenderCellParams<TableRow["type"]>) => (
            <div style={{
                backgroundColor: params.value?.error ? "red" : "",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                {params.value?.type}
            </div>
        ),
    },
    {
        field: "exTime",
        headerName: "Время обмена",
        // headerAlign: "center",
        flex: 2.25,
        // cellClassName: "table-cell",
        renderCell: (params: GridRenderCellParams<TableRow["exTime"]>) => (
            <div style={{
                backgroundColor: params.value?.error ? "red" : "",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                {params.value?.time}
            </div>
        ),
    },
    {
        field: "malfDk",
        headerName: "Состояние ДК",
        // headerAlign: "center",
        flex: 3,
        cellClassName: "table-cell-wrap",
    },
    {
        field: "gps",
        headerName: "GPS",
        // headerAlign: "center",
        flex: 2.75,
        // cellClassName: "table-cell",
    },
    {
        field: "addData",
        headerName: "Доп. данные",
        // headerAlign: "center",
        flex: 5,
        cellClassName: "table-cell-wrap",
    },
    {
        field: "traffic",
        headerName: "Трафик",
        // headerAlign: "center",
        flex: 1.75,
        // cellClassName: "table-cell",
    },
    {
        field: "place",
        headerName: "Место размещения",
        // headerAlign: "center",
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
            // state: id === 1,
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
            addData: device ? checkError(device, true) : "",
            traffic: device ? prettyTraffic(device.Traffic.FromDevice1Hour) + "/" + prettyTraffic(device.Traffic.LastFromDevice1Hour) : "",
            place: cross.describe,
            status: cross.statuscode,
            idevice: cross.idevice
        }
    }

    const generateData = useCallback(() => {
        const initialState: TableRow[] = []
        crosses.forEach((cross, id) => {
            const device = devices.find(dev => dev.device.id === cross.idevice)?.device
            initialState.push(convertToRow(id, cross, device))
        })
        return initialState
    }, [crosses, devices])

    const [rows, setRows] = useState<TableRow[]>(generateData())

    useEffect(() => {
        setRows(generateData())
    }, [generateData])

    const handleCrossSelect = (selected: GridSelectionModel) => {
        props.setSelected(rows[Number(selected[0])].idevice)
    }

    return (
        <div style={{height: "60vh", width: "100%"}}>
            <ThemeProvider theme={theme}>
                <DataGrid
                    hideFooter
                    rows={rows}
                    columns={columns}
                    onSelectionModelChange={handleCrossSelect}
                />
            </ThemeProvider>
        </div>
    )
}

export default TopTable