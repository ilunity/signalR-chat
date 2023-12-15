import {useEffect, useState} from "react";
import {Chat} from "../Chat";
import {ChatEntry} from "../ChatEntry";
import {CssBaseline, Stack} from "@mui/material";
import {connector, IEventsHandlers, IUser} from "../../utils/api.ts";
import {UsersList} from "../UsersList";

export interface IMessage {
    user: IUser;
    text: string;
}

export type History = Record<string, IMessage[]>;


export const App = () => {
    const [userName, setUserName] = useState<string>();
    const [users, setUsers] = useState<IUser[]>([]);
    const [chatUser, setChatUser] = useState<IUser | null>(null);
    const [history, setHistory] = useState<History>({});

    const {events, connectUser} = connector;

    useEffect(() => {
        events.onUsersReceived.subscribe(setUsers);
    }, []);

    const handleReceiveMessage = (connectionId: string, {text, user}: IMessage) => {
        if (!history[connectionId]) {
            return setHistory(prev => ({
                ...prev,
                [connectionId]: [{user, text}]
            }));
        }

        setHistory(prev => ({
            ...prev,
            [connectionId]: [
                ...prev[connectionId],
                {user, text}
            ]
        }))
    }


    useEffect(() => {
        const onMessageHandler: IEventsHandlers['onMessageReceived'] =
            (text, user) => handleReceiveMessage(user.connectionId, {text, user})


        const onMyMessageHandler: IEventsHandlers['onMyMessageReceived'] =
            (text, chatUserConnectionId, connectionId) => {
                const user = {userName, connectionId} as IUser;
                handleReceiveMessage(chatUserConnectionId, {text, user})
            }

        events.onMessageReceived.subscribe(onMessageHandler);
        events.onMyMessageReceived.subscribe(onMyMessageHandler);

        return () => {
            events.onMessageReceived.unsubscribe(onMessageHandler);
            events.onMyMessageReceived.unsubscribe(onMyMessageHandler);
        }
    }, [history, userName]);

    useEffect(() => {
        if (userName) {
            connectUser(userName);
        }
    }, [userName]);

    return (
        <>
            <CssBaseline/>
            {userName
                ? (
                    <Stack
                        direction={'row'}
                        style={{height: '100vh'}}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                    >
                        <UsersList
                            users={users}
                            chatUser={chatUser}
                            setChatUser={setChatUser}
                        />
                        {
                            chatUser &&
                            <Chat
                                chatUser={chatUser}
                                messages={history[chatUser.connectionId] || []}
                            />
                        }
                    </Stack>)
                : <ChatEntry onSubmit={setUserName}/>
            }
        </>
    )
};
