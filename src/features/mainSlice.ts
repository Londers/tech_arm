import {ArmInfo} from "../common";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: ArmInfo = {
    crosses: [],
    devices: [],
    gprs: undefined,
    techArmPrivilege: undefined
}

export const mainSlice = createSlice({
    name: "mapContent",
    initialState,
    reducers: {
        setInitialData: (state, action: PayloadAction<ArmInfo>) => {
            state.crosses = action.payload.crosses
            state.devices = action.payload.devices
            state.gprs = action.payload.gprs
            state.techArmPrivilege = action.payload.techArmPrivilege
        }
    }
})

export const {setInitialData} = mainSlice.actions

export default mainSlice.reducer