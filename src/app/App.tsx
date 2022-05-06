import React, {useEffect, useState} from 'react';
import './App.sass';
import {useAppDispatch} from "./hooks";
import {wsConnect} from "../common/Middlewares/WebSocketMiddleware";
import TopTable from "../features/TopTable";
import Bottom from "../features/Bottom";

function App() {
    const [selectedCross, setSelectedCross] = useState<number>(-1)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
            dispatch(wsConnect("wss://192.168.115.134:4443/user/Admin/techArmW?Region=1&Area=1&Area=2&Area=3"))
        } else {
            dispatch(wsConnect(`wss://${window.location.host}/user/${localStorage.getItem("login")}/techArmW${window.location.search}`))
        }
    }, [dispatch])

    return (
        <div className="App" style={{height: "100%"}}>
            <TopTable setSelected={setSelectedCross}/>
            <Bottom selected={selectedCross}/>
        </div>
    );
}

export default App;
