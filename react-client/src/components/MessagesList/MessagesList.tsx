import {useEffect, useRef} from "react";
import {Message} from "../Message";
import {Stack} from "@mui/material";
import {MessagesListProps} from "./MessagesList.types.ts";

export const MessagesList: React.FC<MessagesListProps> = ({messages}) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => ref?.current?.scrollTo(0, ref.current.scrollHeight), [messages]);

    return (
        <Stack
            ref={ref}
            sx={{
                display: "flex",
                flex: '1 0 auto',
                overflowY: 'auto',
            }}
            alignItems={'end'}
            spacing={2}
        >
            {messages.map((message, index) => (
                <Message
                    key={index}
                    message={message}
                />
            ))}
        </Stack>
    );
};
