import { Box, Typography, TextField, IconButton, Paper, Divider } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState, useRef, useEffect } from "react";

const ChatBox = ({ userName = "You", mentorName = "Mentor" }) => {
  const [messages, setMessages] = useState([
    { sender: "mentor", text: "Welcome to the mentorship chat!" },
    { sender: "you", text: "Hi! I have some doubts about startup funding." },
  ]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "you", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "you", text: input },
        {
          sender: "mentor",
          text: "Thanks for reaching out. I’ll guide you through.",
        },
      ]);
    }, 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Paper
      elevation={4}
      sx={{
        width: "100%",
        maxWidth: "800px",
        height: "80vh",
        mx: "auto",
        mt: 5,
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          backgroundColor: "#1976d2",
          color: "white",
        }}
      >
        <Typography variant="h6">{mentorName}</Typography>
        <Typography variant="body2" color="lightgray">
          Active now
        </Typography>
      </Box>

      {/* Chat Messages */}
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          overflowY: "auto",
          backgroundColor: "#e8f0fe",
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent={msg.sender === "you" ? "flex-end" : "flex-start"}
            mb={1}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 3,
                maxWidth: "70%",
                backgroundColor:
                  msg.sender === "you" ? "#1976d2" : "#ffffff",
                color: msg.sender === "you" ? "white" : "black",
                boxShadow: 2,
              }}
            >
              <Typography variant="body1">{msg.text}</Typography>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Divider />

      {/* Input */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          backgroundColor: "#f0f0f0",
        }}
      >
        <TextField
          fullWidth
          placeholder="Type your message..."
          variant="outlined"
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          sx={{ mr: 2 }}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          sx={{ backgroundColor: "#1976d2", color: "white", ":hover": { backgroundColor: "#115293" } }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatBox;
