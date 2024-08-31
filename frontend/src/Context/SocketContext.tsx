import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import io, { Socket } from "socket.io-client";

// تعریف نوع برای وضعیت آنلاین کاربران
interface OnlineUsers {
  [userId: string]: string; // userId و socketId
}

// تعریف نوع برای SocketContext
interface SocketContextType {
  socket: Socket | null;
  onlineUsers: OnlineUsers;
  userOnline: (userId: string) => void;
  sendMessage: (fromUserId: string, toUserId: string, message: string) => void;
}

// ایجاد کانتکست با نوع مشخص
const SocketContext = createContext<SocketContextType | undefined>(undefined);

// هوک برای استفاده از کانتکست Socket
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

// تعریف نوع Props برای SocketProvider
interface SocketProviderProps {
  children: ReactNode;
}

// پیاده‌سازی SocketProvider با نوع مشخص
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUsers>({});

  useEffect(() => {
    const newSocket = io("http://localhost:4002", { withCredentials: true });
    setSocket(newSocket);

    newSocket.on("onlineUsers", (users: OnlineUsers) => {
      setOnlineUsers(users);
    });

    // بازگشت یک تابع cleanup که socket را زمانی که کامپوننت unmount می‌شود، می‌بندد
    return () => {
      newSocket.close();
    };
  }, []);

  const userOnline = (userId: string) => {
    if (socket) {
      socket.emit("userOnline", userId);
    }
  };

  const sendMessage = (fromUserId: string, toUserId: string, message: string) => {
    if (socket) {
      socket.emit("sendMessage", { fromUserId, toUserId, message });
    }
  };

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, userOnline, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
