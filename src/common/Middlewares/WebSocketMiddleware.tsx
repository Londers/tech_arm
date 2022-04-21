import {createAction, createListenerMiddleware, isAnyOf} from "@reduxjs/toolkit";
import {ArmInfo} from "../index";
import {setInitialData} from "../../features/mainSlice";

export const wsConnect = createAction<string>("websocket/connect")
export const wsGetMessage = createAction<any>('websocket/message')
export const wsSendMessage = createAction<any>('websocket/send')
export const WebSocketListenerMiddleware = createListenerMiddleware()
let ws: WebSocket

WebSocketListenerMiddleware.startListening({
    matcher: isAnyOf(wsConnect, wsGetMessage, wsSendMessage),
    effect: async (action, listenerApi) => {
        if (wsConnect.match(action)) {
            ws = new WebSocket(action.payload)
            ws.onopen = () => console.log("opened")
            ws.onerror = (e) => console.log("error", e)
            ws.onclose = (e) => console.log("closed", e)
            ws.onmessage = (e) => listenerApi.dispatch(wsGetMessage(JSON.parse(e.data)))
        } else if (wsSendMessage.match(action)) {
            ws.send(JSON.stringify(action.payload as any))
        } else if (wsGetMessage.match(action)) {
            switch (action.payload.type) {
                case "armInfo":
                    // listenerApi.dispatch(fillAccountData(action.payload.data as MapInfoMsg))
                    listenerApi.dispatch(setInitialData(action.payload.data as ArmInfo))
                    break;
                case "error":
                    break;
                default:
                    console.log("type not found:", action.payload)
                    break;
            }
        }
    },
})