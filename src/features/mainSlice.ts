import {ArmInfoMsg, CrossesMsg, CrossInfo, DevicesMsg, MainSliceType} from "../common";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../app/store";

const initialState: MainSliceType = {
    crosses: [],
    devices: [],
    gprs: undefined,
    techArmPrivilege: undefined,
    selectedIdevice: -1,
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
        setSelectedIdevice: (state, action: PayloadAction<number>) => {
            state.selectedIdevice = action.payload
        },
    }
})

export const {setInitialData, setCrosses, setDevices, setSelectedIdevice} = mainSlice.actions

export const selectCrosses = (state: RootState) => state.main.crosses
export const selectDevices = (state: RootState) => state.main.devices
export const selectSelectedIdevice = (state: RootState) => state.main.selectedIdevice
export const selectGPRS = (state: RootState) => state.main.gprs
export const selectTechArmAccess = (state: RootState) => state.main.techArmPrivilege ? state.main.techArmPrivilege[4] : false

export default mainSlice.reducer