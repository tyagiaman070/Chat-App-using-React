import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";

import "./Chat.css";
// INFOBAR COMPONENT
import InfoBar from "../InfoBar/InfoBar";
//Input COMPONENT
import Input from "../Input/Input";
//Messages Component
import Messages from "../Messages/Messages";
//TextContainer
import TextContainer from "../TextContainer/TextContainer";
let socket;
const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const ENDPOINT = "http://67ed3c70.ap.ngrok.io";
  //for joining room a userEffect function
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    if (!name && !room) {
      //alert("Cannot enter in an empty room with an empty name");
      window.location.href = "/";
    }
    socket = io(ENDPOINT);
    //console.log(name);
    setName(name);
    setRoom(room);

    socket.emit("join", { name, room }, error => {
      if (error) {
        window.location.href = "/";
        alert(error);
      }
    });

    // return () => {
    //   socket.emit("disconnect");
    //   socket.off();
    // };
  }, [ENDPOINT, location.search]);

  //userEffect for hadlinig messages
  useEffect(() => {
    socket.on("message", message => {
      //
      setMessages([...messages, message]);
    });
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [messages]);
  //function for sending messages
  const sendMessage = event => {
    //to prevent ke kahi kuch press karna sa page refresh ho jaye
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  //console.log(message, messages);

  //for checking if message is typed and enter is hit if yes then call sendMessage()
  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users}></TextContainer>
    </div>
  );
};
export default Chat;
