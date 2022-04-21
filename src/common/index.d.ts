export interface ArmInfoMsg {
    type: string;
    data: ArmInfo;
}

export interface ArmInfo {
    crosses: CrossInfo[];
    devices: DeviceInfo[];
    gprs: Gprs | undefined;
    techArmPrivilege: TechArmPrivilege | undefined;
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

export interface TechArmPrivilege {
    4: boolean;
}

export interface Device {
    id: number;
    name: string;
    scon: boolean;
    ltime: Date;
    dtime: Date;
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