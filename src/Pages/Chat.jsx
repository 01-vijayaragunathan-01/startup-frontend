import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([
    { text: "Hello Mentor!", sender: "student" },
    { text: "Hi there! How can I help you today?", sender: "mentor" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { text: newMessage, sender: "student" }]);
      setNewMessage("");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #e0f7fa, #ffffff)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 5,
        px: 2,
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Chat with Mentor
      </Typography>

      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 800,
          height: "70vh",
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          p: 2,
          background: "#f9f9f9",
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            scrollbarWidth: "thin",
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              alignSelf={msg.sender === "student" ? "flex-end" : "flex-start"}
              sx={{
                background:
                  msg.sender === "student"
                    ? "linear-gradient(135deg, #42a5f5, #1e88e5)"
                    : "linear-gradient(135deg, #eeeeee, #cccccc)",
                color: msg.sender === "student" ? "white" : "black",
                px: 2,
                py: 1,
                borderRadius: 2,
                maxWidth: "70%",
                boxShadow: 3,
              }}
            >
              {msg.text}
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            borderTop: "1px solid #ccc",
            mt: 2,
            pt: 1,
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Type your message..."
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            sx={{ ml: 1 }}
            disabled={!newMessage.trim()}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default Chat;
