import {connector} from "../../utils/api.ts";
import {SendMessageFormProps} from "./SendMessageForm.types.ts";
import {Button, Stack, TextField} from "@mui/material";
import React from "react";

export const SendMessageForm: React.FC<SendMessageFormProps> = ({chatUser}) => {
    const {newMessage} = connector;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const message = data.get('message') as string;
        newMessage(message, chatUser.connectionId);
        // onSubmit(username)
    };


    return (
        <Stack
            direction={'row'}
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
            spacing={6}
        >
            <TextField
                size={'small'}
                required
                fullWidth
                label="Введите сообщение..."
                name="message"
                variant="outlined"
            />
            <Button
                type="submit"
                variant="contained"
                sx={{width: 300}}
            >
                Отправить
            </Button>
        </Stack>
    )
}
