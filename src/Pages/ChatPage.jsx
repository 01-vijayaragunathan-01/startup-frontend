import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import toast from "react-hot-toast";

const socket = io("http://localhost:5000");

const ChatPage = () => {
  const { state } = useLocation();
  const receiverId = state?.receiverId;
  const receiverName = state?.receiverName;

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [receiverDetails, setReceiverDetails] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user || !receiverId) return;

    socket.emit("join", user._id);

    const fetchData = async () => {
      try {
        // Fetch messages
        const msgRes = await axios.get(
          `http://localhost:5000/api/messages/${receiverId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(msgRes.data);

        // Fetch receiver profile
        const userRes = await axios.get(
          `http://localhost:5000/api/profile/user/${receiverId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReceiverDetails(userRes.data);
      } catch (err) {
        toast.error("Failed to load chat or user info");
      }
    };

    fetchData();

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);

      if (msg.sender !== user._id) {
        toast.custom(() => (
          <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
            📩 New message from {receiverName}
          </div>
        ));
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [receiverId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = {
      sender: user._id,
      receiver: receiverId,
      text: input,
    };

    socket.emit("sendMessage", newMessage);

    await axios.post("http://localhost:5000/api/messages", newMessage, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setMessages((prev) => [...prev, { ...newMessage, timestamp: new Date() }]);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f0f2f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 5,
      }}
    >
      <Paper
        sx={{
          width: "90%",
          maxWidth: 700,
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          p: 2,
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <Typography variant="h6" fontWeight="bold" textAlign="center" mb={2}>
          Chat with {receiverDetails?.name || receiverName}
        </Typography>

        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {messages.map((msg, idx) => {
            const isMe = msg.sender === user._id;
            const showAvatar = !isMe ? receiverDetails?.avatar : user?.avatar;
            const senderName = isMe ? user.name : receiverDetails?.name;

            return (
              <Box
                key={idx}
                alignSelf={isMe ? "flex-end" : "flex-start"}
                sx={{
                  display: "flex",
                  flexDirection: isMe ? "row-reverse" : "row",
                  alignItems: "flex-start",
                  gap: 1.5,
                  maxWidth: "80%",
                }}
              >
                <Avatar src={showAvatar} />
                <Box
                  sx={{
                    backgroundColor: isMe ? "#1976d2" : "#e0e0e0",
                    color: isMe ? "white" : "black",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", opacity: 0.8 }}
                  >
                    {senderName}
                  </Typography>
                  <Typography>{msg.text}</Typography>
                </Box>
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </Box>

        <Box display="flex" mt={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <IconButton color="primary" onClick={handleSend}>
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatPage;
