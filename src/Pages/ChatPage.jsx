import {
  Box, TextField, IconButton, Typography, Paper,
  Avatar, Container, Stack,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "https://startup-backend-1-cj33.onrender.com";

const socket = io(BASE_URL);

const ChatPage = () => {
  const { state }    = useLocation();
  const receiverId   = state?.receiverId;
  const receiverName = state?.receiverName;

  const user  = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [messages,        setMessages]        = useState([]);
  const [input,           setInput]           = useState("");
  const [receiverDetails, setReceiverDetails] = useState(null);

  const messagesEndRef     = useRef(null);
  const scrollContainerRef = useRef(null);

  const colors = {
    bg:          "#030014",
    accent:      "#7000ff",
    accentGlow:  "rgba(112,0,255,0.25)",
    glass:       "rgba(255,255,255,0.03)",
    glassBorder: "rgba(255,255,255,0.08)",
    textDim:     "rgba(255,255,255,0.6)",
    myBubble:    "linear-gradient(135deg, #7000ff 0%, #5a00cc 100%)",
    theirBubble: "rgba(255,255,255,0.06)",
  };

  // ── Normalise sender/receiver to string id ──────────────────────────────────
  // MongoDB sometimes returns populated objects { _id, name } instead of plain strings
  const getId = (val) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object" && val._id) return String(val._id);
    return String(val);
  };

  const isMyMessage = (msg) => getId(msg.sender) === getId(user?._id);

  // ── Always scroll to bottom after messages update ───────────────────────────
  // Using a simple ref + direct DOM call avoids React batching issues
  const scrollToBottom = () => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ── Load messages + receiver profile ───────────────────────────────────────
  useEffect(() => {
    if (!user?._id || !receiverId) return;

    socket.emit("join", user._id);

    const fetchData = async () => {
      try {
        const [msgRes, userRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/messages/${receiverId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/profile/user/${receiverId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setMessages(msgRes.data || []);
        setReceiverDetails(userRes.data || null);
      } catch (err) {
        console.error("Chat load error:", err);
        toast.error("Failed to load chat");
      }
    };

    fetchData();

    // ── Receive incoming socket messages ──────────────────────────────────────
    const handleReceive = (msg) => {
      setMessages((prev) => [...prev, msg]);

      if (getId(msg.sender) !== getId(user._id)) {
        toast.success(`New message from ${receiverName}`, {
          icon:  "📩",
          style: {
            borderRadius: "10px",
            background:   "#1a1a2e",
            color:        "#fff",
            border:       "1px solid rgba(112,0,255,0.3)",
          },
        });
      }
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, [receiverId]); // eslint-disable-line

  // ── Send message ────────────────────────────────────────────────────────────
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMessage = {
      sender:    user._id,
      receiver:  receiverId,
      text:      trimmed,
      timestamp: new Date().toISOString(),
    };

    // Optimistic: show immediately
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    socket.emit("sendMessage", newMessage);

    try {
      await axios.post(`${BASE_URL}/api/messages`, newMessage, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      toast.error("Message failed to send");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box sx={{
      minHeight:      "100vh",
      bgcolor:        colors.bg,
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      position:       "relative",
      overflow:       "hidden",
      py:             5,
    }}>
      {/* Background glow */}
      <Box sx={{
        position:      "absolute",
        width:         "60vw",
        height:        "60vw",
        background:    "radial-gradient(circle, rgba(112,0,255,0.06) 0%, transparent 70%)",
        filter:        "blur(120px)",
        top:           "50%",
        left:          "50%",
        transform:     "translate(-50%, -50%)",
        zIndex:        0,
        pointerEvents: "none",
      }} />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Paper sx={{
          height:         "88vh",
          display:        "flex",
          flexDirection:  "column",
          background:     colors.glass,
          backdropFilter: "blur(24px)",
          borderRadius:   "24px",
          border:         `1px solid ${colors.glassBorder}`,
          overflow:       "hidden",
          boxShadow:      "0 30px 60px rgba(0,0,0,0.6)",
        }}>

          {/* ── HEADER ────────────────────────────────────────────────────── */}
          <Box sx={{
            p:            2,
            borderBottom: `1px solid ${colors.glassBorder}`,
            background:   "rgba(112,0,255,0.04)",
            flexShrink:   0,
          }}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={receiverDetails?.avatar}
                  sx={{
                    width:   44,
                    height:  44,
                    border:  `2px solid ${colors.accent}`,
                    bgcolor: colors.accent,
                    fontWeight: 900,
                  }}
                >
                  {(receiverDetails?.name || receiverName)?.[0]?.toUpperCase()}
                </Avatar>
                <Box sx={{
                  position:     "absolute",
                  bottom:       1,
                  right:        1,
                  width:        10,
                  height:       10,
                  borderRadius: "50%",
                  bgcolor:      "#00e676",
                  border:       `2px solid ${colors.bg}`,
                }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={800} color="white" lineHeight={1.1}>
                  {receiverDetails?.name || receiverName}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.accent, fontWeight: 700, letterSpacing: 1 }}>
                  ACTIVE SESSION
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* ── MESSAGES ──────────────────────────────────────────────────── */}
          <Box
            ref={scrollContainerRef}
            sx={{
              flexGrow:      1,
              overflowY:     "auto",
              p:             3,
              display:       "flex",
              flexDirection: "column",
              gap:           2,
              // Custom scrollbar
              "&::-webkit-scrollbar":       { width: "4px" },
              "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
              "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(112,0,255,0.3)", borderRadius: "10px" },
            }}
          >
            {messages.length === 0 && (
              <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>
                  No messages yet. Say hello! 👋
                </Typography>
              </Box>
            )}

            {messages.map((msg, idx) => {
              const isMe      = isMyMessage(msg);
              const avatarSrc = isMe ? user?.avatar : receiverDetails?.avatar;
              const initials  = isMe
                ? user?.name?.[0]?.toUpperCase()
                : (receiverDetails?.name || receiverName)?.[0]?.toUpperCase();

              return (
                <Box
                  key={idx}
                  sx={{
                    display:        "flex",
                    flexDirection:  isMe ? "row-reverse" : "row",
                    alignItems:     "flex-end",
                    gap:            1.5,
                    maxWidth:       "80%",
                    alignSelf:      isMe ? "flex-end" : "flex-start",
                  }}
                >
                  <Avatar
                    src={avatarSrc}
                    sx={{
                      width:      30,
                      height:     30,
                      bgcolor:    colors.accent,
                      fontSize:   "0.75rem",
                      fontWeight: 900,
                      flexShrink: 0,
                    }}
                  >
                    {initials}
                  </Avatar>

                  <Box sx={{
                    background:   isMe ? colors.myBubble : colors.theirBubble,
                    color:        "white",
                    px:           2,
                    py:           1.2,
                    borderRadius: isMe ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                    border:       isMe ? "none" : `1px solid ${colors.glassBorder}`,
                    boxShadow:    isMe ? "0 4px 20px rgba(112,0,255,0.25)" : "none",
                    maxWidth:     "100%",
                  }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.6, wordBreak: "break-word" }}>
                      {msg.text}
                    </Typography>
                    {msg.timestamp && (
                      <Typography variant="caption" sx={{
                        display:   "block",
                        textAlign: isMe ? "right" : "left",
                        mt:        0.4,
                        opacity:   0.4,
                        fontSize:  "0.62rem",
                      }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </Box>

          {/* ── INPUT ─────────────────────────────────────────────────────── */}
          <Box sx={{
            p:          2,
            borderTop:  `1px solid ${colors.glassBorder}`,
            background: "rgba(0,0,0,0.2)",
            flexShrink: 0,
          }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <TextField
                fullWidth
                size="small"
                placeholder={`Message ${receiverDetails?.name || receiverName || ""}…`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                multiline
                maxRows={4}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color:        "white",
                    borderRadius: "14px",
                    bgcolor:      "rgba(255,255,255,0.04)",
                    "& fieldset":               { borderColor: "rgba(255,255,255,0.1)" },
                    "&:hover fieldset":         { borderColor: colors.accent },
                    "&.Mui-focused fieldset":   { borderColor: colors.accent },
                  },
                }}
              />
              <IconButton
                onClick={handleSend}
                disabled={!input.trim()}
                sx={{
                  bgcolor:    input.trim() ? colors.accent : "rgba(255,255,255,0.06)",
                  color:      input.trim() ? "white" : "rgba(255,255,255,0.25)",
                  width:      44,
                  height:     44,
                  flexShrink: 0,
                  transition: "background 0.2s, box-shadow 0.2s",
                  boxShadow:  input.trim() ? "0 4px 16px rgba(112,0,255,0.4)" : "none",
                  "&:hover":  { bgcolor: input.trim() ? "#5a00cc" : "rgba(255,255,255,0.06)" },
                }}
              >
                <SendIcon sx={{ fontSize: "1.1rem" }} />
              </IconButton>
            </Stack>
          </Box>

        </Paper>
      </Container>
    </Box>
  );
};

export default ChatPage;