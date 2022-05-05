export interface IncomingWebSocketMessage {
    type: string
    data: IncomingDataType
}

export type IncomingDataType = ArmInfoMsg | CrossesMsg | DevicesMsg | GprsMsg

export type OutcomingWebSocketMessage = OutcomingDataType

export type OutcomingDataType = GprsChangeMessage | SfdkChangeMessage

export interface ArmInfoMsg {
    crosses: CrossInfo[];
    devices: DeviceInfo[];
    gprs: Gprs | undefined;
    newGprs: Gprs | undefined;
    techArmPrivilege: TechArmPrivilege | undefined;
}

export interface CrossesMsg {
    crosses: CrossInfo[];
}

export interface DevicesMsg {
    devices: DeviceInfo[];
}

export interface CrossInfo {
    region: number;
    area: number;
    id: number;
    idevice: number;
    subarea: number;
    arrayType: number;
    describe: string;
    phone: string;
    statuscode: number;
    status: string;
    Model: Model;
    Arm: string;
}

export interface DeviceInfo {
    region: number;
    area: number;
    idevice: number;
    techMode: string;
    modeRdk: string;
    device: Device;
}

export interface Gprs {
    ip: string;
    port: string;
    send: boolean;
}

export interface GprsChange {
    id: number
    f0x32: boolean
    f0x33: boolean
    f0x34: boolean
    ip: string
    port: number
    long: number
    type: boolean
}

export interface GprsChangeMessage {
    type: string
    gprs: GprsChange
}

export interface GprsMsg {
    status: boolean
}

export interface SfdkChangeMessage {
    type: string
    id: number
    cmd: number
    param: number
}

export interface TechArmPrivilege {
    4: boolean;
}

export interface Device {
    id: number;
    name: string;
    scon: boolean;
    ltime: string;
    dtime: string;
    techmode: number;
    base: boolean;
    pk: number;
    ck: number;
    nk: number;
    ip: string;
    StatusCommandDU: StatusCommandDU;
    DK: DK;
    tmax: number;
    tout: number;
    Model: Model;
    Error: Error;
    GPS: GPS;
    Input: Input;
    Status: Status;
    arrays: Array[];
    LogLines: LogLine[];
    Traffic: Traffic;
}

export interface StatusCommandDU {
    IsPK: boolean;
    IsCK: boolean;
    IsNK: boolean;
    IsDUDK1: boolean;
    IsDUDK2: boolean;
    IsReqSFDK1: boolean;
    IsReqSFDK2: boolean;
}

export interface DK {
    rdk: number;
    fdk: number;
    ddk: number;
    edk: number;
    pdk: boolean;
    eedk: number;
    odk: boolean;
    ldk: number;
    ftudk: number;
    tdk: number;
    ftsdk: number;
    ttcdk: number;
}

export interface Model {
    vpcpdl: number;
    vpcpdr: number;
    vpbsl: number;
    vpbsr: number;
    C12: boolean;
    STP: boolean;
    DKA: boolean;
    DTA: boolean;
}

export interface Error {
    V220DK1: boolean;
    V220DK2: boolean;
    RTC: boolean;
    TVP1: boolean;
    TVP2: boolean;
    FRAM: boolean;
}


export interface GPS {
    Ok: boolean;
    E01: boolean;
    E02: boolean;
    E03: boolean;
    E04: boolean;
    Seek: boolean;
}

export interface Input {
    V1: boolean;
    V2: boolean;
    V3: boolean;
    V4: boolean;
    V5: boolean;
    V6: boolean;
    V7: boolean;
    V8: boolean;
    S: boolean[];
}

export interface Status {
    s220: number;
    sGPS: number;
    sServer: number;
    sPSPD: number;
    elc: number;
    ethernet: boolean;
    tobm: number;
    lnow: number;
    llast: number;
    motiv: number;
}

export interface Array {
    Number: number;
    NElem: number;
    Array: number[];
}

export interface LogLine {
    Time: Date;
    Record: string;
    Info: string;
}

export interface Traffic {
    FromDevice1Hour: number;
    ToDevice1Hour: number;
    LastToDevice1Hour: number;
    LastFromDevice1Hour: number;
}

export interface TableRow {
    id: number
    // state: boolean
    area: number
    subarea: number
    usdk: number
    sv: { sv: string, sfdk: boolean }
    type: { type: string, error: boolean }
    exTime: { time: string, error: boolean }
    malfDk: string
    gps: string
    addData: string
    traffic: string
    place: string
    status: number
    idevice: number
}