import {
  Box, TextField, IconButton, Typography, Paper,
  Avatar, Container, Stack,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "https://startup-backend-1-cj33.onrender.com";

// Socket created once outside component so it doesn't re-instantiate on re-render
const socket = io(BASE_URL);

const ChatPage = () => {
  const { state }      = useLocation();
  const receiverId     = state?.receiverId;
  const receiverName   = state?.receiverName;

  const user           = JSON.parse(localStorage.getItem("user"));
  const token          = localStorage.getItem("token");

  const [messages,         setMessages]         = useState([]);
  const [input,            setInput]            = useState("");
  const [receiverDetails,  setReceiverDetails]  = useState(null);

  // Two refs: one for scroll target, one to track if user is near bottom
  const messagesEndRef    = useRef(null);
  const scrollContainerRef = useRef(null);
  const isNearBottom      = useRef(true);

  const colors = {
    bg:          "#030014",
    accent:      "#7000ff",
    accentGlow:  "rgba(112,0,255,0.25)",
    glass:       "rgba(255,255,255,0.03)",
    glassBorder: "rgba(255,255,255,0.08)",
    textDim:     "rgba(255,255,255,0.6)",
    myBubble:    "linear-gradient(135deg, #7000ff 0%, #5a00cc 100%)",
    theirBubble: "rgba(255,255,255,0.05)",
  };

  // ── Scroll to bottom ──────────────────────────────────────────────────────────
  // Only auto-scroll if user is already near the bottom (prevents jumping while reading old messages)
  const scrollToBottom = useCallback((force = false) => {
    if (force || isNearBottom.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Track whether user is near the bottom of the scroll container
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const threshold = 80; // px from bottom
    isNearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  };

  // ── Scroll whenever messages array changes ────────────────────────────────────
  // This is the fix: useLayoutEffect + direct DOM scroll (no dep on messages length trick)
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ── Initial data load ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !receiverId) return;

    socket.emit("join", user._id);

    const fetchData = async () => {
      try {
        const [msgRes, userRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/messages/${receiverId}`,     { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BASE_URL}/api/profile/user/${receiverId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setMessages(msgRes.data);
        setReceiverDetails(userRes.data);
        // Force scroll after initial load
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "instant" }), 50);
      } catch {
        toast.error("Failed to load chat or user info");
      }
    };

    fetchData();

    // ── Receive socket messages ────────────────────────────────────────────────
    const handleReceive = (msg) => {
      // Only accept messages from the current conversation
      if (msg.sender !== receiverId && msg.receiver !== receiverId) return;

      setMessages((prev) => {
        // Deduplicate: don't add if we already optimistically added it
        const isDupe = prev.some(
          (m) => m.text === msg.text && m.sender === msg.sender &&
                 Math.abs(new Date(m.timestamp) - new Date(msg.timestamp)) < 2000
        );
        return isDupe ? prev : [...prev, msg];
      });

      if (msg.sender !== user._id) {
        toast.success(`New message from ${receiverName}`, {
          icon:  "📩",
          style: { borderRadius: "10px", background: "#1a1a2e", color: "#fff", border: "1px solid rgba(112,0,255,0.3)" },
        });
      }
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, [receiverId, token]);           // ← only re-run when conversation changes

  // ── Send message ──────────────────────────────────────────────────────────────
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMessage = {
      sender:    user._id,
      receiver:  receiverId,
      text:      trimmed,
      timestamp: new Date().toISOString(),
    };

    // Optimistic UI update first
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Then emit + persist
    socket.emit("sendMessage", newMessage);
    try {
      await axios.post(`${BASE_URL}/api/messages`, newMessage, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      toast.error("Message failed to send");
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <Box sx={{
      minHeight:       "100vh",
      bgcolor:         colors.bg,
      display:         "flex",
      alignItems:      "center",
      justifyContent:  "center",
      position:        "relative",
      overflow:        "hidden",
      py:              5,
    }}>
      {/* Background glow */}
      <Box sx={{
        position:  "absolute",
        width:     "60vw", height: "60vw",
        background: `radial-gradient(circle, rgba(112,0,255,0.06) 0%, transparent 70%)`,
        filter:    "blur(120px)",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex:    0,
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
          boxShadow:      `0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(112,0,255,0.04)`,
        }}>

          {/* ── CHAT HEADER ─────────────────────────────────────────────────── */}
          <Box sx={{
            p:            2,
            borderBottom: `1px solid ${colors.glassBorder}`,
            background:   "rgba(112,0,255,0.04)",
          }}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
              <Box sx={{ position: "relative" }}>
                <Avatar src={receiverDetails?.avatar}
                  sx={{
                    width:  44, height: 44,
                    border: `2px solid ${colors.accent}`,
                    bgcolor: colors.accent,
                    fontWeight: 900,
                  }}>
                  {(receiverDetails?.name || receiverName)?.[0]?.toUpperCase()}
                </Avatar>
                {/* Online dot */}
                <Box sx={{
                  position: "absolute", bottom: 1, right: 1,
                  width: 10, height: 10, borderRadius: "50%",
                  bgcolor: "#00e676", border: `2px solid ${colors.bg}`,
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

          {/* ── MESSAGES AREA ───────────────────────────────────────────────── */}
          <Box
            ref={scrollContainerRef}
            onScroll={handleScroll}
            sx={{
              flexGrow:       1,
              overflowY:      "auto",
              p:              3,
              display:        "flex",
              flexDirection:  "column",
              gap:            2,
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
              const isMe      = msg.sender === user._id;
              const avatarSrc = isMe ? user?.avatar : receiverDetails?.avatar;
              const initials  = isMe
                ? user?.name?.[0]?.toUpperCase()
                : (receiverDetails?.name || receiverName)?.[0]?.toUpperCase();

              // Show date separator when day changes
              const showDateSep = idx === 0 || (
                new Date(msg.timestamp).toDateString() !==
                new Date(messages[idx - 1]?.timestamp).toDateString()
              );

              return (
                <React.Fragment key={idx}>
                  {showDateSep && (
                    <Box sx={{ textAlign: "center", my: 1 }}>
                      <Typography variant="caption" sx={{
                        color:   "rgba(255,255,255,0.2)",
                        bgcolor: "rgba(255,255,255,0.04)",
                        px: 2, py: 0.5, borderRadius: "20px",
                        fontSize: "0.65rem", letterSpacing: 1,
                      }}>
                        {new Date(msg.timestamp).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
                      </Typography>
                    </Box>
                  )}

                  <Box
                    alignSelf={isMe ? "flex-end" : "flex-start"}
                    sx={{
                      display:       "flex",
                      flexDirection: isMe ? "row-reverse" : "row",
                      alignItems:    "flex-end",
                      gap:           1.5,
                      maxWidth:      "80%",
                    }}
                  >
                    <Avatar src={avatarSrc}
                      sx={{ width: 30, height: 30, bgcolor: colors.accent, fontSize: "0.75rem", fontWeight: 900, flexShrink: 0 }}>
                      {initials}
                    </Avatar>

                    <Box sx={{
                      background:   isMe ? colors.myBubble : colors.theirBubble,
                      color:        "white",
                      px:           2, py: 1.2,
                      borderRadius: isMe ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                      border:       isMe ? "none" : `1px solid ${colors.glassBorder}`,
                      boxShadow:    isMe ? `0 4px 20px rgba(112,0,255,0.25)` : "none",
                    }}>
                      <Typography variant="body2" sx={{ lineHeight: 1.6, wordBreak: "break-word" }}>
                        {msg.text}
                      </Typography>
                      <Typography variant="caption" sx={{
                        display:   "block",
                        textAlign: isMe ? "right" : "left",
                        mt:        0.4,
                        opacity:   0.45,
                        fontSize:  "0.62rem",
                      }}>
                        {msg.timestamp
                          ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : ""}
                      </Typography>
                    </Box>
                  </Box>
                </React.Fragment>
              );
            })}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </Box>

          {/* ── INPUT AREA ───────────────────────────────────────────────────── */}
          <Box sx={{
            p:         2,
            borderTop: `1px solid ${colors.glassBorder}`,
            background: "rgba(0,0,0,0.2)",
          }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <TextField
                fullWidth size="small"
                placeholder={`Message ${receiverDetails?.name || receiverName || ""}…`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                multiline maxRows={4}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color:        "white",
                    borderRadius: "14px",
                    bgcolor:      "rgba(255,255,255,0.04)",
                    "& fieldset":             { borderColor: "rgba(255,255,255,0.1)" },
                    "&:hover fieldset":       { borderColor: colors.accent },
                    "&.Mui-focused fieldset": { borderColor: colors.accent },
                  },
                }}
              />
              <IconButton onClick={handleSend} disabled={!input.trim()}
                sx={{
                  bgcolor:    input.trim() ? colors.accent : "rgba(255,255,255,0.06)",
                  color:      input.trim() ? "white" : "rgba(255,255,255,0.2)",
                  width:      44, height: 44,
                  transition: "background 0.2s, box-shadow 0.2s",
                  boxShadow:  input.trim() ? `0 4px 16px rgba(112,0,255,0.4)` : "none",
                  "&:hover":  { bgcolor: input.trim() ? "#5a00cc" : "rgba(255,255,255,0.06)" },
                }}>
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