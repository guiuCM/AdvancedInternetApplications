import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Input from "./Components/Input";
import MessageList from "./Components/MessageList";
import UsersList from "./Components/UserList";

const socket = io("http://localhost:3001");

export default function App() {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    socket.on('message', message => {
      setMessages(m => [...m, message]);
    });
    socket.on('users', usersList => {
      setUsers(usersList);
    });
    socket.on('loggedIn', () => {
      setIsLoggedIn(true);
    });

    return () => {
      socket.off('message');
      socket.off('users');
      socket.off('loggedIn');
    };
  }, []);

  const sendMessage = (message) => {
    socket.emit('message', message);
  };

  const login = (nick) => {
    socket.emit('login', nick);
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          <UsersList users={users} />
          <MessageList messages={messages} />
          <Input send={sendMessage} buttonText='Send' />
        </>
      ) : (
        <div>
          <h1>Enter your nickname</h1>
          <Input send={login} buttonText='Login' />
        </div>
      )}
    </div>
  );
}