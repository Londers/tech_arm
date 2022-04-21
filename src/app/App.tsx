import React, {useEffect} from 'react';
import './App.sass';
import {useAppDispatch} from "./hooks";
import {wsConnect} from "../common/Middlewares/WebSocketMiddleware";

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      dispatch(wsConnect("wss://192.168.115.134:4443/user/Admin/techArm?Region=1&Area=1&Area=2&Area=3"))
    } else {
      // dispatch(wsConnect(`wss://${window.location.host}/mapW`))
    }
  })

  return (
      <div className="App" style={{height: window.innerHeight}}>
        smth
      </div>
  );
}

export default App;
