import React from "react";
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

function GPRSDialog(props: { open: boolean, setOpen: Function }) {
    const [open, setOpen] = [props.open, props.setOpen]

    const dispatch = useAppDispatch()
    const gprs = useAppSelector(selectGPRS)

    const handleChange = (e: SelectChangeEvent<boolean>) => {
        dispatch(setGPRS({send: e.target.value === "1"}))
    }

    const handleSubmit = () => {
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
                                control={<Checkbox/>}
                                label="Адрес GPRS-сервера"
                                labelPlacement="start"
                            />
                            <TextField inputProps={{pattern: "^([0-9]{1,3}\\.){3}[0-9]{1,3}$"}} required/>
                            <TextField inputProps={{pattern: "[0-9]*"}}/>
                        </div>
                    </Grid>
                    <Grid item xs>
                        <div style={{display: "inline-flex"}}>
                            <FormControlLabel
                                control={<Checkbox/>}
                                label="Интервал обмена"
                                labelPlacement="start"
                            />
                            <TextField inputProps={{pattern: "[0-9]*"}}/>
                        </div>
                    </Grid>
                    <Grid item xs>
                        <div style={{display: "inline-flex"}}>
                            <FormControlLabel
                                control={<Checkbox/>}
                                label="Режим связи"
                                labelPlacement="start"
                            />
                            <FormControl sx={{marginTop: "2vh", width: "250px"}}>
                                <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip-select"
                                    value={gprs?.send}
                                    onChange={handleChange}
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