import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { io } from "socket.io-client";
import { useAuth } from "@clerk/clerk-react";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { userId } = useAuth();

    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        if (!userId) return;

        const socketInstance = io(
            "http://localhost:4000",
            {
                query: {
                    userId,
                },
            }
        );

        setSocket(socketInstance);

        socketInstance.on(
            "onlineUsers",
            (users) => {
                setOnlineUsers(users);
            }
        );

        return () => {
            socketInstance.disconnect();
        };
    }, [userId]);

    return (
        <SocketContext.Provider
            value={{
                socket,
                onlineUsers,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = () => {
    return useContext(SocketContext);
};