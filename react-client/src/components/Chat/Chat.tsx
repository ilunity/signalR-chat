import React from 'react';
import {ChatProps} from './Chat.types';
import {MessagesList} from "../MessagesList";
import {SendMessageForm} from "../SendMessageForm";
import {Stack} from "@mui/material";

export const Chat: React.FC<ChatProps> = ({chatUser, messages}) => {
    return (
        <Stack
            sx={{
                flex: '1 0 auto',
                height: '100%',
                padding: 3,
            }}
        >
            <MessagesList messages={messages}/>
            <SendMessageForm chatUser={chatUser}/>
        </Stack>
    );

};
