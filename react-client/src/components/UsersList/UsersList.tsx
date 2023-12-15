import React from 'react';
import {UsersListProps} from './UsersList.types';
import {Box, Divider, List, ListItem, ListItemButton, ListItemText, Typography} from "@mui/material";

export const UsersList: React.FC<UsersListProps> = ({users, chatUser, setChatUser}) => {

    return (
        <Box
            sx={{
                height: '100vh',
                width: 300,
                borderRight: '1px solid black'
            }}
        >
            <Typography
                variant={'h5'}
                sx={{padding: 2}}
            >
                Пользователи:
            </Typography>
            <Divider/>
            <List>
                {users.map(userItem => {
                    return (
                        <ListItem key={userItem.connectionId} disablePadding>
                            <ListItemButton
                                onClick={() => setChatUser(userItem)}
                                selected={!!chatUser && userItem.connectionId === chatUser.connectionId}
                            >
                                <ListItemText primary={userItem.userName}/>
                            </ListItemButton>
                        </ListItem>
                    )
                })}
            </List>
        </Box>
    );
};
