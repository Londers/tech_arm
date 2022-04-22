import {createAction, createListenerMiddleware, isAnyOf} from "@reduxjs/toolkit";
import {ArmInfoMsg, CrossesMsg, DevicesMsg, IncomingWebSocketMessage, OutcomingWebSocketMessage} from "../index";
import {setCrosses, setDevices, setInitialData} from "../../features/mainSlice";

export const wsConnect = createAction<string>("websocket/connect")
export const wsGetMessage = createAction<IncomingWebSocketMessage>('websocket/message')
export const wsSendMessage = createAction<OutcomingWebSocketMessage>('websocket/send')
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
                    listenerApi.dispatch(setInitialData(action.payload.data as ArmInfoMsg))
                    break;
                case "crosses":
                    listenerApi.dispatch(setCrosses(action.payload.data as CrossesMsg))
                    break;
                case "devices":
                    listenerApi.dispatch(setDevices(action.payload.data as DevicesMsg))
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