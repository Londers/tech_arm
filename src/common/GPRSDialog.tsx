import React, {ChangeEvent, useState} from "react";
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
import {selectGPRS, setGPRS} from "../features/mainSlice";
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

    const handleIpChange = (event: ChangeEvent<HTMLInputElement>) => setIp(event.currentTarget.value)
    const handlePortChange = (event: ChangeEvent<HTMLInputElement>) => setPort(event.currentTarget.value)
    const handleExchangeIntervalChange = (event: ChangeEvent<HTMLInputElement>) => setExchangeInterval(Number(event.currentTarget.value))
    const handleCommunicationModeChange = (event: SelectChangeEvent) => setCommunicationMode(event.target.value === "1")

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
                      justifyItems="center"
                      alignItems="center">
                    <Grid item xs>
                        <div style={{display: "inline-flex"}}>
                            <FormControlLabel
                                control={<Checkbox value={addressFlag} onChange={() => setAddressFlag(!addressFlag)}/>}
                                label="Адрес GPRS-сервера"
                                labelPlacement="start"
                            />
                            <TextField
                                inputProps={{pattern: "^([0-9]{1,3}\\.){3}[0-9]{1,3}$", placeholder: "Адрес"}}
                                value={ip}
                                onChange={handleIpChange}
                                disabled={!addressFlag}
                                required/>
                            <TextField
                                inputProps={{pattern: "[0-9]*", placeholder: "Порт"}}
                                value={port}
                                onChange={handlePortChange}
                                disabled={!addressFlag}
                                required/>
                        </div>
                    </Grid>
                    <Grid item xs>
                        <div style={{display: "inline-flex"}}>
                            <FormControlLabel
                                control={<Checkbox value={exchangeIntervalFlag} onChange={() => setExchangeIntervalFlag(!exchangeIntervalFlag)}/>}
                                label="Интервал обмена"
                                labelPlacement="start"
                            />
                            <TextField
                                value={exchangeInterval}
                                onChange={handleExchangeIntervalChange}
                                inputProps={{pattern: "[0-9]*"}}
                                disabled={!exchangeIntervalFlag}/>
                        </div>
                    </Grid>
                    <Grid item xs>
                        <div style={{display: "inline-flex"}}>
                            <FormControlLabel
                                control={<Checkbox value={communicationModeFlag}
                                                   onChange={() => setCommunicationModeFlag(!communicationModeFlag)}/>}
                                label="Режим связи"
                                labelPlacement="start"
                            />
                            <FormControl sx={{marginTop: "2vh", width: "250px"}} disabled={!communicationModeFlag}>
                                <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip-select"
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