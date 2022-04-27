import React from "react";
import {Box, Button, Grid} from "@mui/material";
import {useAppSelector} from "../app/hooks";
import {selectCrosses, selectCrossesCount, selectDevices, selectDevicesCount} from "./mainSlice";
import {
    checkError,
    checkMalfunction, decodeInputErrors, phaseSpellOut,
    switchArrayType,
    switchArrayTypeFromDevice,
    timeFormat
} from "../common/MessageDecoding";

function Bottom(props: { selected: number }) {
    const cross = useAppSelector(selectCrosses).find(cross => cross.idevice === props.selected)
    const deviceInfo = useAppSelector(selectDevices).find(device => device.device.id === props.selected)
    const device = deviceInfo?.device
    const crossesCount = useAppSelector(selectCrossesCount)
    const devicesCount = useAppSelector(selectDevicesCount)

    return (
        <>
            {cross &&
                <Box flexGrow={1} style={{height: "40vh"}}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="baseline">
                        <Grid item xs>
                            {device ? switchArrayTypeFromDevice(device.Model) : switchArrayType(cross.arrayType)}
                        </Grid>
                        <Grid item xs>
                            {cross.id}
                        </Grid>
                        <Grid item xs>
                            {device ? (device.Status.ethernet ? "LAN" : "G") : ""}
                        </Grid>
                        <Grid item xs>
                            {cross.describe}
                        </Grid>
                        <Grid item xs>
                            <Button variant="outlined" onClick={e => console.log(e)}>
                                ДК {cross.id}
                            </Button>
                        </Grid>
                        <Grid item xs>
                            <Button variant="outlined" onClick={e => console.log(e)}>
                                Привязка
                            </Button>
                        </Grid>
                    </Grid>
                    <div style={{display: "inline-flex"}}>
                        <Grid
                            container
                            direction="column"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            style={{width: "10vw"}}>
                            <Grid item xs>
                                КРЦ {cross.area}
                            </Grid>
                            <Grid item xs>
                                Подр {cross.subarea}
                            </Grid>
                            <Grid item xs>
                                {device ? timeFormat(device.dtime) : ""}
                            </Grid>
                            <Grid item xs>
                                {device ? timeFormat(device.ltime) : ""}
                            </Grid>
                            <Grid item xs>
                                <Button variant="outlined" onClick={e => console.log(e)}>
                                    Контроль
                                </Button>
                            </Grid>
                            <Grid item xs>
                                <Button variant="outlined" onClick={e => console.log(e)}>
                                    GPRS-обмен
                                </Button>
                            </Grid>
                            <Grid item xs>
                                <Button variant="outlined" onClick={e => console.log(e)}>
                                    {device?.StatusCommandDU.IsReqSFDK1 ? "Выкл. СФ" : "Вкл. СФ"}
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="flex-start"
                            style={{width: "30vw"}}
                        >
                            <Grid item xs>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="space-around"
                                    alignItems="center"
                                >
                                    <Grid item xs>
                                        {cross.phone.replaceAll("\"", "")}
                                    </Grid>
                                    <Grid item xs>
                                        Т.контр {device?.Status.tobm}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="space-around"
                                    alignItems="center"
                                >
                                    <Grid item xs>
                                        Центр:
                                    </Grid>
                                    <Grid item style={{color: device?.StatusCommandDU.IsDUDK1 ? "black" : "#b0b1b2"}}
                                          xs>
                                        ДУ ДК
                                    </Grid>
                                    <Grid item style={{color: device?.StatusCommandDU.IsReqSFDK1 ? "black" : "#b0b1b2"}}
                                          xs>
                                        СФ ДК
                                    </Grid>
                                    <Grid item style={{color: device?.StatusCommandDU.IsPK ? "black" : "#b0b1b2"}} xs>
                                        ПК
                                    </Grid>
                                    <Grid item style={{color: device?.StatusCommandDU.IsCK ? "black" : "#b0b1b2"}} xs>
                                        СК
                                    </Grid>
                                    <Grid item style={{color: device?.StatusCommandDU.IsNK ? "black" : "#b0b1b2"}} xs>
                                        НК
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs>
                                Технология: {deviceInfo?.techMode}
                            </Grid>
                            <Grid item xs>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="space-around"
                                    alignItems="center"
                                >
                                    <Grid item style={{color: device?.StatusCommandDU.IsPK ? "black" : "#b0b1b2"}} xs>
                                        ПК
                                    </Grid>
                                    <Grid item style={{color: device?.StatusCommandDU.IsCK ? "black" : "#b0b1b2"}} xs>
                                        СК
                                    </Grid>
                                    <Grid item style={{color: device?.StatusCommandDU.IsNK ? "black" : "#b0b1b2"}} xs>
                                        НК
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs>
                                <Grid
                                    container
                                    direction="column"
                                    justifyContent="center"
                                    alignItems="flex-start">
                                    <Grid item xs>
                                        Режим: {deviceInfo?.modeRdk}
                                    </Grid>
                                    <Grid item xs>
                                        Уст-во: {device ? switchArrayTypeFromDevice(device.Model) : "-"}
                                    </Grid>
                                    <Grid item xs>
                                        Состояние: {device ? checkMalfunction(device.Error) : "-"}
                                    </Grid>
                                    <Grid item xs>
                                        Фаза: {device ? phaseSpellOut(device.DK.fdk) : "-"}
                                    </Grid>
                                    <Grid item xs>
                                        Лампы: {device?.DK.ldk}
                                    </Grid>
                                    <Grid item xs>
                                        Двери: {device?.DK.odk ? "Открыты" : "Закрыты"}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="column"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            style={{width: "60vw"}}>
                            <Grid item xs>
                                Прочее {device ? checkError(device) : ""}
                            </Grid>
                            <Grid item xs>
                                Сигнал GSM {device ? device.Status.lnow + ', ' + device.Status.llast : ""}
                            </Grid>
                            <Grid item xs>
                                GPS {device?.Status.sGPS}
                            </Grid>
                            <Grid item xs>
                                № модема {cross.idevice}
                            </Grid>
                            <Grid item xs>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="space-around"
                                    alignItems="center"
                                >
                                    <Grid item xs>
                                        IP: {device?.ip}
                                    </Grid>
                                    <Grid item xs>
                                        {device ? "Ошибка " + decodeInputErrors(device.Input) : ""}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Grid item xs>
                                        <Grid
                                            container
                                            direction="column"
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <Grid item xs>
                                                Дополнение
                                            </Grid>
                                            <Grid item xs>
                                                ПО ПСПД {device ? device.Model.vpcpdl + '.' + device.Model.vpcpdr : "-"}
                                            </Grid>
                                            <Grid item xs>
                                                ПО ПБС {device ? device.Model.vpbsl + '.' + device.Model.vpbsr : "-"}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs>
                                        <Grid
                                            container
                                            direction="column"
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <Grid item xs>
                                                Количество устройтв: {devicesCount}
                                            </Grid>
                                            <Grid item xs>
                                                Количество привязок: {crossesCount}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </Box>
            }
        </>
    )
}

export default Bottom