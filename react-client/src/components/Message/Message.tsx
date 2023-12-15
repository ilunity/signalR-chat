import {MessageProps} from "./Message.types.ts";
import {Card, CardContent, Typography} from "@mui/material";

export const Message: React.FC<MessageProps> = ({message: {user, text}}) => {
    return (
        <Card
            sx={{maxWidth: 400}}
            variant={'outlined'}
        >
            <CardContent
            sx={{
                padding: 2,
            }}
            >
                <Typography gutterBottom variant="h5" component="div">
                    {user.userName}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{wordBreak: 'break-all'}}
                >
                    {text}
                </Typography>
            </CardContent>
        </Card>
    )
}
