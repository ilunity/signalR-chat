import React from 'react';
import {ChatEntryProps} from './ChatEntry.types';
import {Avatar, Box, Button, TextField, Typography} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export const ChatEntry: React.FC<ChatEntryProps> = ({onSubmit}) => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get('username') as string;
        onSubmit(username)
    };

    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                <LockOutlinedIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
                Вход
            </Typography>
            <Box
                component="form"
                sx={{mt: 1}}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <TextField
                    required
                    fullWidth
                    label="User name"
                    name="username"
                    variant="outlined"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{mt: 3, mb: 2}}
                >
                    Подтвердить
                </Button>
            </Box>
        </Box>
    );
};
