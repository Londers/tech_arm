import {ArmInfoMsg, CrossesMsg, CrossInfo, DevicesMsg, Gprs, GprsMsg} from "../common";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../app/store";

const initialState: ArmInfoMsg = {
    crosses: [],
    devices: [],
    gprs: undefined,
    newGprs: undefined,
    techArmPrivilege: undefined,
}

const crossesSort = (a: CrossInfo, b: CrossInfo) =>
    (a.area !== b.area) ? (a.area - b.area) : ((a.subarea !== b.subarea) ? (a.subarea - b.subarea) : (a.id - b.id))

export const mainSlice = createSlice({
    name: "mapContent",
    initialState,
    reducers: {
        setInitialData: (state, action: PayloadAction<ArmInfoMsg>) => {
            state.crosses = action.payload.crosses.sort(crossesSort)
            state.devices = action.payload.devices
            state.gprs = action.payload.gprs
            state.techArmPrivilege = action.payload.techArmPrivilege
        },
        setCrosses: (state, action: PayloadAction<CrossesMsg>) => {
            state.crosses = action.payload.crosses.sort(crossesSort)
        },
        setDevices: (state, action: PayloadAction<DevicesMsg>) => {
            action.payload.devices.forEach(newDev => {
                const index = state.devices.findIndex(oldDev => oldDev.idevice === newDev.idevice)
                state.devices.splice(index, 1, newDev)
            })
        },
        setGPRS: (state, action: PayloadAction<Gprs>) => {
            // if (state.gprs) {
                // if (action.payload.ip) {
                // state.gprs.ip = action.payload.ip
                // }
                // if (action.payload.port) {
                // state.gprs.port = action.payload.port.toString()
                // }
                // if (action.payload.send !== undefined) {
                // state.gprs.send = action.payload.send
                // }
            // }
            state.gprs = action.payload
        },
        setNewGPRS: (state, action: PayloadAction<GprsMsg>) => {
            if (action.payload.status) {
                state.gprs = state.newGprs
            } else {
                state.newGprs = state.gprs
            }
        }
    }
})

export const {setInitialData, setCrosses, setDevices, setGPRS, setNewGPRS} = mainSlice.actions

export const selectCrosses = (state: RootState) => state.main.crosses
export const selectCrossesCount = (state: RootState) => state.main.crosses.length
export const selectDevices = (state: RootState) => state.main.devices
export const selectDevicesCount = (state: RootState) => state.main.devices.filter(devInfo => devInfo.device.scon).length
export const selectGPRS = (state: RootState) => state.main.gprs
export const selectTechArmAccess = (state: RootState) => state.main.techArmPrivilege ? state.main.techArmPrivilege[4] : false

export default mainSlice.reducer