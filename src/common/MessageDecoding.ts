import {Device, Error, Model, GPS, Input} from "./index";

const GPSText = new Map<string, string>([
    ["Ok", "Исправно"],
    ["E01", "Нет связи с приемником"],
    ["E02", "Ошибка CRC"],
    ["E03", "Нет валидного времени"],
    ["E04", "Мало спутников"],
    ["Seek", "Поиск спутников"],
])

export const checkGPS = (GPS: GPS) => {
    let retValue = "";
    for (const [key, value] of Object.entries(GPS)) {
        if (value) retValue += GPSText.get(key) + ", "
    }
    return (retValue.length !== 0) ? retValue.substring(0, retValue.length - 2) : "";
}

// Расшифровка типа устройства
export const switchArrayTypeFromDevice = (model: Model) => {
    if (model.C12) return "С12"
    if (model.DKA) return "ДКА"
    if (model.DTA) return "ДТА"
    return "УСДК"
}

export const switchArrayType = (type: number) => {
    switch (type) {
        case 1:
            return "С12УСДК"
        case 2:
            return "УСДК"
        case 4:
            return "ДКА"
        case 8:
            return "ДТА"
    }
    return "Нет данных"
}

export const timeFormat = (time: Date) => {
    let date = new Date(time);
    // date = new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000));
    const dateTimeFormat = new Intl.DateTimeFormat("ru", {
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

export const prettyTraffic = (tf: number) => {
    return (tf / 1024).toFixed(1) + "Кб";
}

const mErrorText = new Map<number, string>([
    [0, "Ошибок в процессе соединения с сервером не было зарегистрировано"],
    [1, "Не было обмена или некорректный обмен с модемом"],
    [2, "Не удалось зарегистрироваться в GSM-сети за отведенный интервал времени"],
    [3, "Не удалось войти в GPRS-канал за отведённый интервал времени"],
    [4, "Не было соединения с сервером после нескольких попыток"],
    [5, "Sim-карта не была установлена"],
    [6, "Не было ответов от сервера при попытке подключения"],
    [7, "Не было ответов от сервера при попытке подключения"],
    [8, "Сервер разорвал предыдущее соединение"],
    [9, "Модем не подчинился сигналу включения/выключения"],
    [10, "Не было связи с сервером"],
    [11, "Неверная контрольная сумма принимаемого сообщения"],
    [12, "Не было подтверждения от сервера на прием информации от УСКД"],
    [16, "Внутренняя ошибка модема"],
    [20, "Были получены новые параметры обмена с сервера"],
    [21, "Таймаут по отсутствию связи с сервером"],
    [22, "Было получено СМС с настройками"],
    [23, "Произошла перезагрузка по пропаданию и восстановлению сетевого питания"],
    [24, "Было обновление программы"],
    [25, "Не было данных с сервера в режиме обмена"],
    [26, "Произошла суточная перезагрузка"],
    [27, "Произошло несанкционированное выключение модема"],
    [28, "Был загружен новый IP-адрес сервера по USB"],
    [29, "Произошел тайм-аут при установлении соединения"],
    [50, "Не было данных от сервера в течение интервала обмена  +1 минута"],
    [51, "Был разрыв связи по команде ПСПД"],
    [52, "Модем выдал сообщение об ошибке в процессе обмена"],
])

const ErrorsText = new Map<string, string>([
    ["V220DK1", "220В ДК1"],
    ["V220DK2", "220В ДК2"],
    ["RTC", "Часы RTC"],
    ["TVP1", "ТВП1"],
    ["TVP2", "ТВП2"],
    ["FRAM", "FRAM"],
])

export const checkMalfunction = (error: Error) => {
    let retValue = "";
    for (const [key, value] of Object.entries(error)) {
        if (value) retValue += ErrorsText.get(key) + ", ";
    }
    return (retValue.length !== 0) ? ("неисправности " + retValue.substring(0, retValue.length - 2)) : ".";
}

export const checkError = (device: Device, malfunction: boolean) => {
    const err = mErrorText.get(device.Status.elc)
    if (malfunction) {
        return (err ? err : ("Неизвестный код неисправности " + device.Status.elc)) + ", " + checkMalfunction(device.Error)
    } else {
        return (err ? err : ("Неизвестный код неисправности " + device.Status.elc))
    }
}

// Расшифровка фазы
export const phaseSpellOut = (phase: number) => {
    switch (phase) {
        case 0:
            return 'ЛР';
        case 9:
            return 'Пром. такт';
        case 10:
        case 14:
            return 'ЖМ';
        case 11:
        case 15:
            return 'ОС';
        case 12:
            return 'КК';
        default:
            return phase
    }
}

export const decodeInputErrors = (input: Input) => {
    const inputs: number[] = []
    const statistics: number[] = []

    Object.entries(input).forEach((entry: [string, boolean | boolean[]], index) => {
        const [, value] = entry
        if (typeof value === "boolean") {
            if (value) inputs.push(index + 1)
        } else {
            value.forEach((st: boolean, stIndex: number) => {
                if (st) statistics.push(stIndex + 1)
            })
        }
    })
    if (inputs.length === 0 && statistics.length === 0) return "отсутствует"
    return "вх. " + inputs.join(", ") + ", ст. " + statistics.join(", ")
}