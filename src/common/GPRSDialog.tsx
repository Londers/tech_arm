import React, {ChangeEvent, useEffect, useState} from "react";
import {
    Button,
    Checkbox, Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl,
    FormControlLabel,
    Grid, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField
} from "@mui/material";
import "./GPRSDialog.sass"
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {selectGPRS} from "../features/mainSlice";
import {Device, GprsChange} from "./index";
import {wsSendMessage} from "./Middlewares/WebSocketMiddleware";

function GPRSDialog(props: { open: boolean, setOpen: Function, device: Device }) {
    const [open, setOpen] = [props.open, props.setOpen]

    const dispatch = useAppDispatch()
    const gprs = useAppSelector(selectGPRS)

    const [addressFlag, setAddressFlag] = useState<boolean>(false)
    const [exchangeIntervalFlag, setExchangeIntervalFlag] = useState<boolean>(false)
    const [communicationModeFlag, setCommunicationModeFlag] = useState<boolean>(false)

    const [ip, setIp] = useState<string>(gprs?.ip ?? "")
    const [port, setPort] = useState<string>(gprs?.port ?? "")
    const [exchangeInterval, setExchangeInterval] = useState<number>(props.device.Status.tobm)
    const [communicationMode, setCommunicationMode] = useState<boolean>(gprs?.send ?? false)

    useEffect(() => {
        setAddressFlag(false)
        setExchangeIntervalFlag(false)
        setCommunicationModeFlag(false)
        setIp(gprs?.ip ?? "")
        setPort(gprs?.port ?? "")
        setExchangeInterval(props.device.Status.tobm)
        setCommunicationMode(gprs?.send ?? false)
    }, [open])

    const handleIpChange = (event: ChangeEvent<HTMLInputElement>) => setIp(event.currentTarget.value)
    const handlePortChange = (event: ChangeEvent<HTMLInputElement>) => setPort(event.currentTarget.value)
    const handleExchangeIntervalChange = (event: ChangeEvent<HTMLInputElement>) => setExchangeInterval(Number(event.currentTarget.value))
    const handleCommunicationModeChange = (event: SelectChangeEvent) => setCommunicationMode(event.target.value === "1")

    const handleAddressFlagChange = () => {
        setAddressFlag(!addressFlag)
        setIp(gprs?.ip ?? "")
        setPort(gprs?.port ?? "")
    }

    const handleExchangeIntervalFlagChange = () => {
        setExchangeIntervalFlag(!exchangeIntervalFlag)
        setExchangeInterval(props.device.Status.tobm)
    }

    const handleCommunicationModeFlagChange = () => {
        setCommunicationModeFlag(!communicationModeFlag)
        setCommunicationMode(gprs?.send ?? false)
    }

    const handleSubmit = () => {
        const newGprs = {} as GprsChange
        newGprs.id = props.device.id
        newGprs.f0x32 = addressFlag
        newGprs.f0x33 = exchangeIntervalFlag
        newGprs.f0x34 = communicationModeFlag
        newGprs.ip = ip
        newGprs.port = Number(port)
        newGprs.long = exchangeInterval
        newGprs.type = communicationMode
        dispatch(wsSendMessage({type: "gprs", gprs: newGprs}))
        setOpen(false)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Dialog open={open}>
            <DialogTitle>GPRS-обмен</DialogTitle>
            <DialogContent>
                <Grid container
                      direction="column"
                      justifyItems="left"
                      alignItems="left">
                    <Grid item xs>
                        <div style={{
                            display: "inline-flex",
                            width: "100%",
                            justifyContent: "space-between",
                            margin: "10px"
                        }}>
                            <FormControlLabel
                                control={<Checkbox value={addressFlag} onChange={handleAddressFlagChange}/>}
                                label="Адрес GPRS-сервера"
                                labelPlacement="start"
                            />
                            <TextField
                                inputProps={{pattern: "^([0-9]{1,3}\\.){3}[0-9]{1,3}$", placeholder: "Адрес"}}
                                style={{width: "150px"}}
                                value={ip}
                                onChange={handleIpChange}
                                disabled={!addressFlag}
                                required/>
                            <div style={{alignSelf: "center"}}>:</div>
                            <TextField
                                inputProps={{pattern: "[0-9]*", placeholder: "Порт"}}
                                style={{width: "75px"}}
                                value={port}
                                onChange={handlePortChange}
                                disabled={!addressFlag}
                                required/>
                        </div>
                    </Grid>
                    <Grid item xs>
                        <div style={{
                            display: "inline-flex",
                            width: "100%",
                            justifyContent: "space-between",
                            margin: "10px"
                        }}>
                            <FormControlLabel
                                control={<Checkbox value={exchangeIntervalFlag}
                                                   onChange={handleExchangeIntervalFlagChange}/>}
                                label="Интервал обмена"
                                labelPlacement="start"
                            />
                            <TextField
                                inputProps={{pattern: "[0-9]*"}}
                                style={{width: "75px"}}
                                value={exchangeInterval}
                                onChange={handleExchangeIntervalChange}
                                disabled={!exchangeIntervalFlag}/>
                        </div>
                    </Grid>
                    <Grid item xs>
                        <div style={{
                            display: "inline-flex",
                            width: "100%",
                            justifyContent: "space-between",
                            margin: "10px"
                        }}>
                            <FormControlLabel
                                control={<Checkbox value={communicationModeFlag}
                                                   onChange={handleCommunicationModeFlagChange}/>}
                                label="Режим связи"
                                labelPlacement="start"
                            />
                            <FormControl sx={{alignContent: "right"}} disabled={!communicationModeFlag}>
                                <Select
                                    value={communicationMode ? "1" : "0"}
                                    onChange={handleCommunicationModeChange}
                                    input={<OutlinedInput/>}
                                >
                                    <MenuItem key={0} value="0">Стандартный</MenuItem>
                                    <MenuItem key={1} value="1">Экономный</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button type="submit" onClick={handleSubmit}>Подтвердить</Button>
                <Button onClick={handleClose}>Отмена</Button>
            </DialogActions>
        </Dialog>
    )
}

export default GPRSDialog