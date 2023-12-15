import {IUser} from "../../utils/api.ts";

export interface UsersListProps {
    users: IUser[];
    chatUser: IUser | null;
    setChatUser: (user: IUser) => void;
}
