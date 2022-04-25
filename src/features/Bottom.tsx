import React from "react";
import {Box, Button, Grid} from "@mui/material";
import {useAppSelector} from "../app/hooks";
import {selectCrosses, selectDevices} from "./mainSlice";
import {
    checkError,
    checkMalfunction, phaseSpellOut,
    switchArrayType,
    switchArrayTypeFromDevice,
    timeFormat
} from "../common/MessageDecoding";

function Bottom(props: { selected: number }) {
    const cross = useAppSelector(selectCrosses).find(cross => cross.idevice === props.selected)
    const deviceInfo = useAppSelector(selectDevices).find(device => device.device.id === props.selected)
    const device = deviceInfo?.device

    return (
        <>
            {cross &&
                <Box flexGrow={1} style={{height: "50vh"}}>
                    <Grid container
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                          columns={24}>
                        <Grid item xs={1}>
                            {device ? switchArrayTypeFromDevice(device.Model) : switchArrayType(cross.arrayType)}
                        </Grid>
                        <Grid item xs={1}>
                            {cross.id}
                        </Grid>
                        <Grid item xs={1}>
                            {device ? (device.Status.ethernet ? "LAN" : "G") : ""}
                        </Grid>
                        <Grid item xs={9}>
                            {cross.describe}
                        </Grid>
                        <Grid item xs={4}>
                            {cross.phone.replaceAll("\"", "")}
                        </Grid>
                        <Grid item xs={8}/>
                    </Grid>
                    <Grid container
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="flex-start">
                        <Grid item xs>
                            Т.контр {device?.Status.tobm}
                        </Grid>
                        <Grid item xs>
                            <Button variant="outlined" onClick={e => console.log(e)}>
                                Привязка
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="flex-start">
                        <Grid item xs>
                            КРЦ {cross.area}
                        </Grid>
                        <Grid item xs>
                            Центр:
                        </Grid>
                        <Grid item style={{color: device?.StatusCommandDU.IsDUDK1 ? "black" : "#b0b1b2"}} xs>
                            ДУ ДК
                        </Grid>
                        <Grid item style={{color: device?.StatusCommandDU.IsReqSFDK1 ? "black" : "#b0b1b2"}} xs>
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
                    <Grid container
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="flex-start">
                        <Grid item xs>
                            Подр {cross.subarea}
                        </Grid>
                        <Grid item xs>
                            Модем: {device?.Status.lnow}
                        </Grid>
                        <Grid item xs>
                            GPS {device?.Status.sGPS}
                        </Grid>
                        <Grid item xs>
                            Прочее {device ? checkError(device) : ""}
                        </Grid>
                    </Grid>
                    <Grid container
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="flex-start">
                        <Grid item xs>
                            {device ? timeFormat(device.dtime) : ""}
                        </Grid>
                    </Grid>
                    <Grid container
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="flex-start">
                        <Grid item xs>
                            {device ? timeFormat(device.ltime) : ""}
                        </Grid>
                        <Grid item xs>
                            Технология: {deviceInfo?.techMode}
                        </Grid>
                        <Grid item xs>
                            ПК: {device?.pk}
                        </Grid>
                        <Grid item xs>
                            СК: {device?.ck}
                        </Grid>
                        <Grid item xs>
                            НК: {device?.nk}
                        </Grid>
                        <Grid item xs>
                            № модема {cross.idevice}
                        </Grid>
                    </Grid>
                    <Grid container
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="flex-start">
                        <Grid item xs>
                            <Button variant="outlined" onClick={e => console.log(e)}>
                                ДК {cross.id}
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                    >
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
                        <Grid item xs>
                                IP: {device?.ip}
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                    >
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
                </Box>
            }
        </>
    )
}

export default Bottom