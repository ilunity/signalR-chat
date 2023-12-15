import * as signalR from "@microsoft/signalr";

const URL = "https://localhost:7001/chat";

export interface IUser {
    connectionId: string;
    userName: string;
}

type EventArgs = Array<any>;

type SignalEventHandler<Args extends EventArgs> = (...args: Args) => void;


class SignalEvent<Args extends EventArgs> {
    private handlers: SignalEventHandler<Args>[] = [];

    constructor(connection: signalR.HubConnection, methodName: string) {
        connection.on(methodName, (...args: Args) => {
            this.handlers.forEach(handler => handler(...args));
        });
    }

    public subscribe = (handler: SignalEventHandler<Args>) => {
        this.handlers.push(handler);
    }

    public unsubscribe = (handler: SignalEventHandler<Args>) => {
        const deletedHandlerIndex = this.handlers.findIndex(v => v === handler);
        this.handlers.splice(deletedHandlerIndex, 1);
    }
}


export interface IEventsHandlers {
    onMessageReceived: (message: string, user: IUser) => void;
    onUsersReceived: (users: IUser[]) => void;
    onMyMessageReceived: (message: string, chatUserConnectionId: string, myConnectionId: string) => void
}

interface IEvents {
    onMessageReceived: SignalEvent<Parameters<IEventsHandlers['onMessageReceived']>>;
    onUsersReceived: SignalEvent<Parameters<IEventsHandlers['onUsersReceived']>>;
    onMyMessageReceived: SignalEvent<Parameters<IEventsHandlers['onMyMessageReceived']>>;
}

class Connector {
    private connection: signalR.HubConnection;
    public events = {} as IEvents;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.Debug)
            .withUrl(URL)
            .withAutomaticReconnect()
            .build();

        this.connection.start().catch(err => document.write(err));

        this.events.onMessageReceived =
            new SignalEvent<Parameters<IEventsHandlers['onMessageReceived']>>(
                this.connection,
                'ReceiveMessage'
            )

        this.events.onMyMessageReceived =
            new SignalEvent<Parameters<IEventsHandlers['onMyMessageReceived']>>(
                this.connection,
                'ReceiveMyMessage'
            )

        this.events.onUsersReceived =
            new SignalEvent<Parameters<IEventsHandlers['onUsersReceived']>>(
                this.connection,
                'ReceiveUsers'
            )
    }

    public newMessage = (message: string, connectionId: string) => {
        this.connection.invoke('SendMessage', message, connectionId)
            .catch(function (err) {
                return console.error(err.toString());
            });
    }

    public connectUser = (userName: string) => {
        this.connection.invoke('ConnectUser', userName)
            .catch(function (err) {
                return console.error(err.toString());
            });
    }
}

export const connector = new Connector();
