import {IUser} from "../../utils/api.ts";
import {IMessage} from "../App/App.tsx";

export interface ChatProps {
    chatUser: IUser;
    messages: IMessage[];
}
