import React, {useCallback, useEffect, useState} from "react";
import {useAppSelector} from "../app/hooks";
import {selectCrosses, selectDevices} from "./mainSlice";
import {DataGrid, GridColDef, GridRenderCellParams, ruRU,} from "@mui/x-data-grid";
import {CrossInfo, Device, GPS, Model, Error} from "../common";
import {createTheme, ThemeProvider} from "@mui/material";
import "./TopTable.sass"

const theme = createTheme(
    {
        palette: {
            primary: {main: '#1976d2'},
        },
    },
    ruRU,
);

interface TableRow {
    id: number
    // state: boolean
    area: number
    subarea: number
    usdk: number
    sv: string
    type: string
    exTime: string
    malfDk: string
    gps: string
    addData: string
    traffic: string
    place: string
    status: number
    idevice: number
}

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
    },
    {
        field: "type",
        headerName: "Тип",
        // headerAlign: "center",
        flex: 1,
        // cellClassName: "table-cell",
    },
    {
        field: "exTime",
        headerName: "Время обмена",
        // headerAlign: "center",
        flex: 2.25,
        // cellClassName: "table-cell",
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
        flex: 1.5,
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

const GPSText = new Map<string, string>([
    ["Ok", "Исправно"],
    ["E01", "Нет связи с приемником"],
    ["E02", "Ошибка CRC"],
    ["E03", "Нет валидного времени"],
    ["E04", "Мало спутников"],
    ["Seek", "Поиск спутников"],
])

const checkGPS = (GPS: GPS) => {
    let retValue = '';
    for (const [key, value] of Object.entries(GPS)) {
        if (value) retValue += GPSText.get(key) + ', '
    }
    return (retValue.length !== 0) ? retValue.substring(0, retValue.length - 2) : '';
}

// Расшифровка типа устройства
const switchArrayTypeFromDevice = (model: Model) => {
    if (model.C12) return 'С12'
    if (model.DKA) return 'ДКА'
    if (model.DTA) return 'ДТА'
    return 'УСДК'
}

const switchArrayType = (type: number) => {
    switch (type) {
        case 1:
            return 'С12УСДК'
        case 2:
            return 'УСДК'
        case 4:
            return 'ДКА'
        case 8:
            return 'ДТА'
    }
    return 'Нет данных'
}

const timeFormat = (time: Date) => {
    let date = new Date(time);
    // date = new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000));
    const dateTimeFormat = new Intl.DateTimeFormat('ru', {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    // console.log(date);
    return dateTimeFormat.format(date);
}

const prettyTraffic = (tf: number) => {
    return (tf / 1024).toFixed(1);
}

const mErrorText = new Map<number, string>([
    [0, 'Ошибок в процессе соединения с сервером не было зарегистрировано'],
    [1, 'Не было обмена или некорректный обмен с модемом'],
    [2, 'Не удалось зарегистрироваться в GSM-сети за отведенный интервал времени'],
    [3, 'Не удалось войти в GPRS-канал за отведённый интервал времени'],
    [4, 'Не было соединения с сервером после нескольких попыток'],
    [5, 'Sim-карта не была установлена'],
    [6, 'Не было ответов от сервера при попытке подключения'],
    [7, 'Не было ответов от сервера при попытке подключения'],
    [8, 'Сервер разорвал предыдущее соединение'],
    [9, 'Модем не подчинился сигналу включения/выключения'],
    [10, 'Не было связи с сервером'],
    [11, 'Неверная контрольная сумма принимаемого сообщения'],
    [12, 'Не было подтверждения от сервера на прием информации от УСКД'],
    [16, 'Внутренняя ошибка модема'],
    [20, 'Были получены новые параметры обмена с сервера'],
    [21, 'Таймаут по отсутствию связи с сервером'],
    [22, 'Было получено СМС с настройками'],
    [23, 'Произошла перезагрузка по пропаданию и восстановлению сетевого питания'],
    [24, 'Было обновление программы'],
    [25, 'Не было данных с сервера в режиме обмена'],
    [26, 'Произошла суточная перезагрузка'],
    [27, 'Произошло несанкционированное выключение модема'],
    [28, 'Был загружен новый IP-адрес сервера по USB'],
    [29, 'Произошел тайм-аут при установлении соединения'],
    [50, 'Не было данных от сервера в течение интервала обмена  +1 минута'],
    [51, 'Был разрыв связи по команде ПСПД'],
    [52, 'Модем выдал сообщение об ошибке в процессе обмена'],
])

const ErrorsText = new Map<string, string>([
    ['V220DK1', '220В ДК1'],
    ['V220DK2', '220В ДК2'],
    ['RTC', 'Часы RTC'],
    ['TVP1', 'ТВП1'],
    ['TVP2', 'ТВП2'],
    ['FRAM', 'FRAM'],
])

const checkMalfunction = (error: Error) => {
    let retValue = '';
    for (const [key, value] of Object.entries(error)) {
        if (value) retValue += ErrorsText.get(key) + ', ';
    }
    return (retValue.length !== 0) ? (', неисправности ' + retValue.substring(0, retValue.length - 2)) : '.';
}

const checkError = (device: Device) => {
    const err = mErrorText.get(device.Status.elc)
    return (err ? err : ('Неизвестный код неисправности ' + device.Status.elc)) + checkMalfunction(device.Error)
}

function TopTable() {
    const crosses = useAppSelector(selectCrosses)
    const devices = useAppSelector(selectDevices)

    const convertToRow = (id: number, cross: CrossInfo, device: Device | undefined): TableRow => {
        return {
            id,
            // state: id === 1,
            area: cross.area,
            subarea: cross.subarea,
            usdk: cross.id,
            sv: device ? (device.scon ? (device.Status.ethernet ? 'L' : '+') : '') : '',
            type: device ? switchArrayTypeFromDevice(device.Model) : switchArrayType(cross.arrayType),
            exTime: device ? timeFormat(device.ltime) : "",
            malfDk: cross.status,
            gps: device ? checkGPS(device.GPS) : "",
            addData: device ? checkError(device) : "",
            traffic: device ? prettyTraffic(device.Traffic.FromDevice1Hour) + '/' + prettyTraffic(device.Traffic.LastFromDevice1Hour) : '',
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


    // crosses.forEach(cross => {
    //     const device = devices.find(dev => dev.device.id === cross.idevice)
    //     setRows(rows.map(row => {
    //         if (row.idevice === cross.idevice) return convertToRow(cross, device);
    //         return row;
    //     }))
    // })

    return (
        <div style={{height: "50vh", width: "100%"}}>
            <ThemeProvider theme={theme}>
                <DataGrid
                    hideFooter
                    rows={rows}
                    columns={columns}/>
            </ThemeProvider>
        </div>
    )
}

export default TopTable