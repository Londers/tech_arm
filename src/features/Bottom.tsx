import React from "react";
import {Box, Button, Grid} from "@mui/material";
import {useAppSelector} from "../app/hooks";
import {selectCrosses, selectCrossesCount, selectDevices, selectDevicesCount} from "./mainSlice";
import {
    checkError,
    checkMalfunction,
    decodeInputErrors,
    phaseSpellOut,
    switchArrayType,
    switchArrayTypeFromDevice,
    timeFormat
} from "../common/MessageDecoding";
import "./Bottom.sass"

function Bottom(props: { selected: number }) {
    const cross = useAppSelector(selectCrosses).find(cross => cross.idevice === props.selected)
    const deviceInfo = useAppSelector(selectDevices).find(device => device.device.id === props.selected)
    const device = deviceInfo?.device
    const crossesCount = useAppSelector(selectCrossesCount)
    const devicesCount = useAppSelector(selectDevicesCount)

    return (
        <>
            {cross &&
                <Box flexGrow={1} style={{height: "calc(40vh - 40px)", margin: "20px"}}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        columns={20}
                        style={{height: "calc(5vh)"}}>
                        <Grid item xs={.6} className="test">
                            {device ? switchArrayTypeFromDevice(device.Model) : switchArrayType(cross.arrayType)}
                        </Grid>
                        <Grid item xs={.6}>
                            {cross.id}
                        </Grid>
                        <Grid item xs={.8}>
                            {device ? (device.Status.ethernet ? "LAN" : "G") : ""}
                        </Grid>
                        <Grid item xs className="test">
                            {cross.describe}
                        </Grid>
                        <Grid item xs={2}>
                            <Button variant="outlined" onClick={e => console.log(e)}>
                                ДК {cross.id}
                            </Button>
                        </Grid>
                        <Grid item xs={2}>
                            <Button variant="outlined" onClick={e => console.log(e)}>
                                Привязка
                            </Button>
                        </Grid>
                    </Grid>
                    <div style={{display: "inline-flex", height: "calc(35vh - 40px)"}}>
                        <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            style={{width: "10vw"}}
                            columns={12}>
                            <Grid item xs className="test" style={{display: "inherit"}}>
                                <div style={{width: "30%"}}>КРЦ</div>
                                <div style={{width: "30%", textAlign: "center"}}>{cross.area}</div>
                            </Grid>
                            <Grid item xs className="test" style={{display: "inherit"}}>
                                <div style={{width: "30%"}}>Подр</div>
                                <div style={{width: "30%", textAlign: "center"}}>{cross.subarea}</div>
                            </Grid>
                            <Grid item xs className="test" style={{display: "inherit"}}>
                                {device ? timeFormat(device.dtime) : ""}
                            </Grid>
                            <Grid item xs className="test" style={{display: "inherit"}}>
                                {device ? timeFormat(device.ltime) : ""}
                            </Grid>
                            <Grid item xs={2} className="test" style={{display: "inherit"}}>
                                <Button variant="outlined" style={{width: "70%"}} onClick={e => console.log(e)}>
                                    Контроль
                                </Button>
                            </Grid>
                            <Grid item xs={2} className="test" style={{display: "inherit"}}>
                                <Button variant="outlined" style={{width: "70%"}} onClick={e => console.log(e)}>
                                    GPRS-обмен
                                </Button>
                            </Grid>
                            <Grid item xs={2} className="test" style={{display: "inherit"}}>
                                <Button variant="outlined" style={{width: "70%"}} onClick={e => console.log(e)}>
                                    {device?.StatusCommandDU.IsReqSFDK1 ? "Выкл. СФ" : "Вкл. СФ"}
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="left"
                            style={{width: "30vw"}}
                            columns={12}>
                            <Grid item xs
                                  container
                                  className="test"
                                  direction="row"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  style={{width: "30vw"}}>
                                <Grid item xs>
                                    {cross.phone.replaceAll("\"", "")}
                                </Grid>
                                <Grid item xs style={{textAlign: "center"}}>
                                    Т.контр {device?.Status.tobm}
                                </Grid>
                            </Grid>
                            <Grid item xs
                                  container
                                  className="test"
                                  direction="row"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  style={{width: "30vw"}}>
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
                            <Grid item xs className="test" style={{display: "inherit"}}>
                                <div style={{width: "25%"}}>Технология:</div>
                                <div style={{width: "75%"}}>{deviceInfo?.techMode}</div>
                            </Grid>
                            <Grid item xs
                                  container
                                  className="test"
                                  direction="row"
                                  justifyContent="space-around"
                                  alignItems="center"
                                  style={{width: "15vw"}}>
                                <Grid item xs>
                                    ПК {device?.pk}
                                </Grid>
                                <Grid item xs>
                                    СК {device?.ck}
                                </Grid>
                                <Grid item xs>
                                    НК {device?.nk}
                                </Grid>
                            </Grid>
                            <Grid item xs={6}
                                  container
                                  direction="column"
                                  justifyContent="center"
                                  alignItems="flex-start">
                                <Grid item xs style={{display: "inherit"}} className="test">
                                    <div style={{width: "25%"}}>Режим</div>
                                    <div style={{width: "75%"}}>{deviceInfo?.modeRdk}</div>
                                </Grid>
                                <Grid item xs style={{display: "inherit"}} className="test">
                                    <div style={{width: "25%"}}>Уст-во</div>
                                    <div style={{width: "75%"}}>{device ? switchArrayTypeFromDevice(device.Model) : "-"}</div>
                                </Grid>
                                <Grid item xs style={{display: "inherit"}} className="test">
                                    <div style={{width: "25%"}}>Состояние</div>
                                    <div style={{width: "75%"}}>{device ? checkMalfunction(device.Error) : "-"}</div>
                                </Grid>
                                <Grid item xs style={{display: "inherit"}} className="test">
                                    <div style={{width: "25%"}}>Фаза</div>
                                    <div style={{width: "75%"}}>{device ? phaseSpellOut(device.DK.fdk) : "-"}</div>
                                </Grid>
                                <Grid item xs style={{display: "inherit"}} className="test">
                                    <div style={{width: "25%"}}>Лампы</div>
                                    <div style={{width: "75%"}}>{device?.DK.ldk}</div>
                                </Grid>
                                <Grid item xs style={{display: "inherit"}} className="test">
                                    <div style={{width: "25%"}}>Двери</div>
                                    <div style={{width: "75%"}}>{device?.DK.odk ? "Открыты" : "Закрыты"}</div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="column"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            style={{width: "calc(60vw - 40px)"}}
                            columns={12}>
                            <Grid item xs>
                                Прочее {device ? checkError(device, false) : ""}
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
                            <Grid item xs style={{display: "inherit"}} className="test">
                                <div style={{width: "30%"}}>IP: {device?.ip}</div>
                                <div style={{width: "70%"}}>{device ? "Ошибка " + decodeInputErrors(device.Input) : ""}</div>
                            </Grid>
                            <Grid item xs={6}
                                  container
                                  direction="row"
                                  justifyContent="space-between"
                                  alignItems="center">
                                <Grid item xs
                                      container
                                      direction="column"
                                      justifyContent="center"
                                      alignItems="center">
                                    <Grid item xs className="test">
                                        Дополнение
                                    </Grid>
                                    <Grid item xs className="test">
                                        ПО ПСПД {device ? device.Model.vpcpdl + '.' + device.Model.vpcpdr : "-"}
                                    </Grid>
                                    <Grid item xs className="test">
                                        ПО ПБС {device ? device.Model.vpbsl + '.' + device.Model.vpbsr : "-"}
                                    </Grid>
                                </Grid>
                                <Grid item xs
                                      container
                                      direction="column"
                                      justifyContent="center"
                                      alignItems="center">
                                    <Grid item xs>
                                        Количество устройтв: {devicesCount}
                                    </Grid>
                                    <Grid item xs>
                                        Количество привязок: {crossesCount}
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