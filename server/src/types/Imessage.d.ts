
export enum MessageType {
    OPEN = 'open',
    LEAVE = "LEAVE",
	CANDIDATE = "CANDIDATE",
	OFFER = "OFFER",
	ANSWER = "ANSWER",
	EXPIRE = "EXPIRE",
	HEARTBEAT = "HEARTBEAT",
	ID_TAKEN = "ID-TAKEN",
	ERROR = "ERROR",
}

export type Handler = (
    socket:any,
    message:IMessage
) => boolean

export interface IMessage {
    type:MessageType,

}