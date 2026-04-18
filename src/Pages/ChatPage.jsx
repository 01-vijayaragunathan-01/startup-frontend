import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Box, TextField, IconButton, Typography, Avatar, Stack, Tooltip,
  Menu, MenuItem, CircularProgress, Container, Paper,
} from "@mui/material";
import SendIcon          from "@mui/icons-material/Send";
import ImageIcon         from "@mui/icons-material/Image";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon         from "@mui/icons-material/Close";
import ArrowBackIcon     from "@mui/icons-material/ArrowBack";
import EmojiPicker       from "emoji-picker-react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import toast from "react-hot-toast";
import { useUnread } from "../Context/UnreadContext";

const BASE_URL = "https://startup-backend-1-cj33.onrender.com";
const socket   = io(BASE_URL, { transports: ["websocket"] });

const C = {
  bg:          "#f0f4ff",
  white:       "#ffffff",
  accent:      "#1565c0",
  accentAlt:   "#1e88e5",
  accentBg:    "rgba(21,101,192,0.07)",
  border:      "rgba(21,101,192,0.14)",
  textDim:     "#546e7a",
  dark:        "#1a237e",
  myBubble:    "linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)",
  theirBubble: "#ffffff",
};

const getId = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object" && val._id) return String(val._id);
  return String(val);
};

const ChatPage = () => {
  const { state }    = useLocation();
  const navigate     = useNavigate();
  const receiverId   = state?.receiverId;
  const receiverName = state?.receiverName;

  const user  = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const { markRead } = useUnread();

  const [messages,        setMessages]        = useState([]);
  const [input,           setInput]           = useState("");
  const [receiverDetails, setReceiverDetails] = useState(null);
  const [showEmoji,       setShowEmoji]       = useState(false);
  const [sending,         setSending]         = useState(false);
  const [imagePreview,    setImagePreview]    = useState(null);
  const [contextMenu,     setContextMenu]     = useState(null);

  const scrollRef  = useRef(null);
  const fileRef    = useRef(null);
  const emojiRef   = useRef(null);

  const isMyMessage = (msg) => getId(msg.sender) === getId(user?._id);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // Close emoji picker on outside click
  useEffect(() => {
    const handler = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) setShowEmoji(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Load messages + receiver profile
  useEffect(() => {
    if (!user?._id || !receiverId) return;
    socket.emit("join", user._id);
    // Mark messages from this sender as read immediately
    if (receiverId) markRead(receiverId);

    const fetchData = async () => {
      try {
        const [msgRes, userRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/messages/${receiverId}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BASE_URL}/api/profile/user/${receiverId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setMessages(msgRes.data || []);
        setReceiverDetails(userRes.data || null);
      } catch {
        toast.error("Failed to load chat");
      }
    };
    fetchData();

    const handleReceive = (msg) => {
      setMessages((prev) => [...prev, msg]);
      const senderId = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
      if (String(senderId) !== String(user._id)) {
        // Auto-mark read since user is currently in this chat
        if (String(senderId) === String(receiverId)) markRead(receiverId);
        toast.success(`New message from ${receiverName}`, {
          icon: "📩",
          style: { borderRadius: "12px", background: C.dark, color: "#fff", border: `1px solid ${C.border}` },
        });
      }
    };
    socket.on("receiveMessage", handleReceive);
    return () => { socket.off("receiveMessage", handleReceive); };
  }, [receiverId]); // eslint-disable-line

  // ── Send text message ──────────────────────────────────────────────────────
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed && !imagePreview) return;
    setSending(true);

    // If image selected, upload it first
    if (imagePreview) {
      try {
        const fd = new FormData();
        fd.append("image", imagePreview.file);
        fd.append("receiver", receiverId);
        const res = await axios.post(`${BASE_URL}/api/messages/image`, fd, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
        const saved = res.data;
        setMessages((prev) => [...prev, saved]);
        socket.emit("sendMessage", saved);
        setImagePreview(null);
      } catch {
        toast.error("Image failed to send");
      }
      setSending(false);
      return;
    }

    const newMessage = { sender: user._id, receiver: receiverId, text: trimmed, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    socket.emit("sendMessage", newMessage);

    try {
      await axios.post(`${BASE_URL}/api/messages`, { receiver: receiverId, text: trimmed }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      toast.error("Message failed to send");
    }
    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // ── Delete message ─────────────────────────────────────────────────────────
  const handleDelete = async (msgId) => {
    setContextMenu(null);
    if (!msgId) return;
    try {
      await axios.delete(`${BASE_URL}/api/messages/${msgId}`, { headers: { Authorization: `Bearer ${token}` } });
      setMessages((prev) => prev.filter((m) => String(m._id) !== String(msgId)));
      toast.success("Message deleted");
    } catch { toast.error("Failed to delete"); }
  };

  // ── Emoji picker ───────────────────────────────────────────────────────────
  const onEmojiClick = (emojiData) => setInput((prev) => prev + emojiData.emoji);

  // ── Image file pick ────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview({ file, dataUrl: reader.result });
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // ── Context menu (right-click / long-press) ────────────────────────────────
  const handleContextMenu = (e, msg) => {
    if (!isMyMessage(msg)) return;
    e.preventDefault();
    setContextMenu({ mouseX: e.clientX, mouseY: e.clientY, msg });
  };

  if (!receiverId) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Stack alignItems="center" spacing={2}>
          <Typography color={C.textDim} fontWeight={700}>No conversation selected.</Typography>
          <IconButton onClick={() => navigate("/dashboard")} sx={{ color: C.accent }}><ArrowBackIcon /></IconButton>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: C.bg, display: "flex", alignItems: "center", justifyContent: "center", py: 5 }}>
      <Container maxWidth="md" sx={{ height: "88vh", display: "flex", flexDirection: "column" }}>
        <Paper sx={{
          flex: 1, display: "flex", flexDirection: "column", borderRadius: "24px",
          border: `1px solid ${C.border}`, boxShadow: "0 8px 40px rgba(21,101,192,0.10)", overflow: "hidden", bgcolor: C.white,
        }}>

          {/* ── HEADER ──────────────────────────────────────────────────────── */}
          <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${C.border}`, bgcolor: C.white, flexShrink: 0 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton onClick={() => navigate(-1)} sx={{ color: C.textDim, "&:hover": { color: C.accent } }}>
                <ArrowBackIcon />
              </IconButton>
              <Box sx={{ position: "relative" }}>
                <Avatar src={receiverDetails?.avatar}
                  sx={{ width: 44, height: 44, bgcolor: C.accent, fontWeight: 900, border: `2px solid ${C.border}` }}>
                  {(receiverDetails?.name || receiverName)?.[0]?.toUpperCase()}
                </Avatar>
                <Box sx={{ position: "absolute", bottom: 2, right: 2, width: 10, height: 10, borderRadius: "50%", bgcolor: "#43a047", border: `2px solid ${C.white}` }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={800} color={C.dark}>
                  {receiverDetails?.name || receiverName}
                </Typography>
                <Typography variant="caption" sx={{ color: C.accentAlt, fontWeight: 700, letterSpacing: 1 }}>
                  ACTIVE SESSION
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* ── MESSAGES ────────────────────────────────────────────────────── */}
          <Box ref={scrollRef} sx={{
            flex: 1, overflowY: "auto", p: 3, display: "flex", flexDirection: "column", gap: 1.5, bgcolor: C.bg,
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-thumb": { bgcolor: C.border, borderRadius: "10px" },
          }}>
            {messages.length === 0 && (
              <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="body2" color={C.textDim} fontStyle="italic">No messages yet. Say hello! 👋</Typography>
              </Box>
            )}

            {messages.map((msg, idx) => {
              const isMe     = isMyMessage(msg);
              const avatarSrc = isMe ? user?.avatar : receiverDetails?.avatar;
              const initials  = isMe ? user?.name?.[0]?.toUpperCase() : (receiverDetails?.name || receiverName)?.[0]?.toUpperCase();

              return (
                <Box key={msg._id || idx}
                  onContextMenu={(e) => handleContextMenu(e, msg)}
                  sx={{ display: "flex", flexDirection: isMe ? "row-reverse" : "row", alignItems: "flex-end", gap: 1, maxWidth: "78%", alignSelf: isMe ? "flex-end" : "flex-start" }}>

                  <Avatar src={avatarSrc} sx={{ width: 28, height: 28, bgcolor: C.accent, fontSize: "0.7rem", fontWeight: 900, flexShrink: 0 }}>
                    {initials}
                  </Avatar>

                  <Box>
                    <Box sx={{
                      background:   isMe ? C.myBubble : C.theirBubble,
                      color:        isMe ? "#fff" : C.dark,
                      px: 2, py: 1.2,
                      borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      border:       isMe ? "none" : `1px solid ${C.border}`,
                      boxShadow:    isMe ? "0 4px 16px rgba(21,101,192,0.2)" : "0 2px 8px rgba(21,101,192,0.05)",
                      maxWidth: "100%",
                      position: "relative",
                    }}>
                      {msg.imageUrl ? (
                        <Box component="img" src={msg.imageUrl} alt="shared"
                          sx={{ maxWidth: 240, maxHeight: 280, borderRadius: "10px", display: "block", cursor: "pointer" }}
                          onClick={() => window.open(msg.imageUrl, "_blank")}
                        />
                      ) : (
                        <Typography variant="body2" sx={{ lineHeight: 1.6, wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
                          {msg.text}
                        </Typography>
                      )}
                      <Typography variant="caption" sx={{
                        display: "block", textAlign: isMe ? "right" : "left", mt: 0.3,
                        opacity: 0.5, fontSize: "0.58rem", color: isMe ? "rgba(255,255,255,0.7)" : C.textDim,
                      }}>
                        {new Date(msg.timestamp || msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </Typography>
                    </Box>

                    {/* Delete button — only on own messages with a real _id */}
                    {isMe && msg._id && (
                      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.4 }}>
                        <Tooltip title="Delete for me">
                          <IconButton size="small" onClick={() => handleDelete(msg._id)}
                            sx={{ color: "rgba(198,40,40,0.45)", p: 0.3, "&:hover": { color: "#c62828" } }}>
                            <DeleteOutlineIcon sx={{ fontSize: "0.9rem" }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })}
            <div ref={(el) => el?.scrollIntoView?.({ behavior: "smooth" })} />
          </Box>

          {/* ── IMAGE PREVIEW BAR ───────────────────────────────────────────── */}
          {imagePreview && (
            <Box sx={{ px: 3, py: 1.5, borderTop: `1px solid ${C.border}`, bgcolor: C.white, display: "flex", alignItems: "center", gap: 2 }}>
              <Box component="img" src={imagePreview.dataUrl} alt="preview" sx={{ width: 60, height: 60, objectFit: "cover", borderRadius: "10px", border: `1px solid ${C.border}` }} />
              <Typography variant="caption" color={C.textDim} flex={1}>Image ready to send</Typography>
              <IconButton size="small" onClick={() => setImagePreview(null)} sx={{ color: C.textDim }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          {/* ── INPUT BAR ───────────────────────────────────────────────────── */}
          <Box sx={{ px: 2.5, py: 2, borderTop: `1px solid ${C.border}`, bgcolor: C.white, flexShrink: 0, position: "relative" }}>

            {/* Emoji picker floating panel */}
            {showEmoji && (
              <Box ref={emojiRef} sx={{ position: "absolute", bottom: "100%", left: 16, zIndex: 100 }}>
                <EmojiPicker onEmojiClick={onEmojiClick} theme="light" height={380} width={320} />
              </Box>
            )}

            <Stack direction="row" spacing={1} alignItems="center">
              {/* Emoji */}
              <Tooltip title="Emoji">
                <IconButton onClick={() => setShowEmoji((s) => !s)}
                  sx={{ color: showEmoji ? C.accent : C.textDim, "&:hover": { color: C.accent } }}>
                  <EmojiEmotionsIcon />
                </IconButton>
              </Tooltip>

              {/* Image upload */}
              <Tooltip title="Send image">
                <IconButton component="label" sx={{ color: C.textDim, "&:hover": { color: C.accent } }}>
                  <ImageIcon />
                  <input hidden type="file" accept="image/*" ref={fileRef} onChange={handleFileChange} />
                </IconButton>
              </Tooltip>

              {/* Text input */}
              <TextField fullWidth size="small"
                placeholder={`Message ${receiverDetails?.name || receiverName || ""}…`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                multiline maxRows={4}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px", bgcolor: C.bg,
                    "& fieldset": { borderColor: C.border },
                    "&:hover fieldset": { borderColor: C.accent },
                    "&.Mui-focused fieldset": { borderColor: C.accent },
                  },
                }}
              />

              {/* Send */}
              <IconButton onClick={handleSend} disabled={sending || (!input.trim() && !imagePreview)}
                sx={{
                  bgcolor:    (input.trim() || imagePreview) ? C.accent : C.border,
                  color:      (input.trim() || imagePreview) ? "#fff" : C.textDim,
                  width: 44, height: 44, flexShrink: 0,
                  boxShadow: (input.trim() || imagePreview) ? "0 4px 16px rgba(21,101,192,0.3)" : "none",
                  "&:hover": { bgcolor: (input.trim() || imagePreview) ? C.accentAlt : C.border },
                  transition: "all 0.2s",
                }}>
                {sending ? <CircularProgress size={16} color="inherit" /> : <SendIcon sx={{ fontSize: "1.1rem" }} />}
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      </Container>

      {/* Right-click context menu */}
      <Menu open={Boolean(contextMenu)} onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={contextMenu ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
        PaperProps={{ sx: { borderRadius: "12px", border: `1px solid ${C.border}`, boxShadow: "0 8px 24px rgba(21,101,192,0.12)" } }}>
        <MenuItem onClick={() => handleDelete(contextMenu?.msg?._id)}
          sx={{ color: "#c62828", gap: 1, fontWeight: 700 }}>
          <DeleteOutlineIcon fontSize="small" /> Delete Message
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ChatPage;