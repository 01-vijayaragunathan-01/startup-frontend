import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  Avatar,
  Container,
  Stack,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import toast from "react-hot-toast";

const socket = io("https://startup-backend-1-cj33.onrender.com");

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

  // Premium Theme Colors
  const colors = {
    bg: "#030014",
    accent: "#7000ff",
    glass: "rgba(255, 255, 255, 0.03)",
    glassBorder: "rgba(255, 255, 255, 0.08)",
    textDim: "rgba(255, 255, 255, 0.6)",
    myBubble: "linear-gradient(135deg, #7000ff 0%, #5a00cc 100%)",
    theirBubble: "rgba(255, 255, 255, 0.05)",
  };

  useEffect(() => {
    if (!user || !receiverId) return;

    socket.emit("join", user._id);

    const fetchData = async () => {
      try {
        const msgRes = await axios.get(
          `https://startup-backend-1-cj33.onrender.com/api/messages/${receiverId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(msgRes.data);

        const userRes = await axios.get(
          `https://startup-backend-1-cj33.onrender.com/api/profile/user/${receiverId}`,
          { headers: { Authorization: `Bearer ${token}` } }
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
        toast.success(`New message from ${receiverName}`, {
          icon: '📩',
          style: { borderRadius: '10px', background: '#333', color: '#fff' },
        });
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [receiverId, token, user, receiverName]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = {
      sender: user._id,
      receiver: receiverId,
      text: input,
    };

    socket.emit("sendMessage", newMessage);

    await axios.post("https://startup-backend-1-cj33.onrender.com/api/messages", newMessage, {
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
        bgcolor: colors.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: 'relative',
        overflow: 'hidden',
        py: 5,
      }}
    >
      {/* Background Decorative Glow */}
      <Box sx={{
        position: 'absolute',
        width: '50vw', height: '50vw',
        background: `radial-gradient(circle, rgba(112,0,255,0.05) 0%, transparent 70%)`,
        filter: 'blur(100px)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 0
      }} />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          sx={{
            height: "85vh",
            display: "flex",
            flexDirection: "column",
            background: colors.glass,
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            border: `1px solid ${colors.glassBorder}`,
            overflow: "hidden",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
          }}
        >
          {/* CHAT HEADER */}
          <Box sx={{ p: 2, borderBottom: `1px solid ${colors.glassBorder}`, textAlign: 'center' }}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
              <Avatar src={receiverDetails?.avatar} sx={{ border: `2px solid ${colors.accent}` }} />
              <Box>
                <Typography variant="h6" fontWeight={800} color="white">
                  {receiverDetails?.name || receiverName}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.accent, fontWeight: 700 }}>
                  Active Session
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* MESSAGES AREA */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '10px' }
            }}
          >
            {messages.map((msg, idx) => {
              const isMe = msg.sender === user._id;
              const showAvatar = !isMe ? receiverDetails?.avatar : user?.avatar;

              return (
                <Box
                  key={idx}
                  alignSelf={isMe ? "flex-end" : "flex-start"}
                  sx={{
                    display: "flex",
                    flexDirection: isMe ? "row-reverse" : "row",
                    alignItems: "flex-end",
                    gap: 1.5,
                    maxWidth: "85%",
                  }}
                >
                  <Avatar src={showAvatar} sx={{ width: 32, height: 32 }} />
                  <Box
                    sx={{
                      background: isMe ? colors.myBubble : colors.theirBubble,
                      color: "white",
                      px: 2,
                      py: 1.5,
                      borderRadius: isMe ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                      border: isMe ? 'none' : `1px solid ${colors.glassBorder}`,
                      boxShadow: isMe ? `0 4px 15px rgba(112,0,255,0.3)` : 'none'
                    }}
                  >
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>{msg.text}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', textAlign: isMe ? 'right' : 'left', mt: 0.5, opacity: 0.5, fontSize: '0.65rem' }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
            <div ref={messagesEndRef} />
          </Box>

          {/* INPUT AREA */}
          <Box sx={{ p: 2, borderTop: `1px solid ${colors.glassBorder}` }}>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Message your mentor..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    borderRadius: '14px',
                    bgcolor: 'rgba(255,255,255,0.03)',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover fieldset': { borderColor: colors.accent },
                  }
                }}
              />
              <IconButton 
                onClick={handleSend}
                sx={{ 
                  bgcolor: colors.accent, 
                  color: 'white',
                  '&:hover': { bgcolor: '#5a00cc' }
                }}
              >
                <SendIcon />
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ChatPage;