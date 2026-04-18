/**
 * UnreadContext
 * ─────────────────────────────────────────────────────────────────────────────
 * Manages real-time unread message counters across the whole app.
 *
 * Provides:
 *   totalUnread    – total unread messages (for Navbar badge)
 *   unreadBySender – { [senderId]: count } (for per-contact badges)
 *   markRead(uid)  – call when a chat with `uid` is opened
 */
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const BASE_URL    = "https://startup-backend-1-cj33.onrender.com";
const UnreadCtx   = createContext({
  totalUnread:    0,
  unreadBySender: {},
  markRead:       () => {},
});

export const UnreadProvider = ({ children }) => {
  const [unreadBySender, setUnreadBySender] = useState({});
  const socketRef = useRef(null);

  const user  = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  // ── Fetch initial unread counts from backend ────────────────────────────
  useEffect(() => {
    if (!user || !token) return;

    const fetchUnread = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/messages/unread`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUnreadBySender(res.data.bySender || {});
      } catch (err) {
        console.warn("UnreadContext: failed to fetch unread counts", err.message);
      }
    };

    fetchUnread();
  }, [user?._id]); // eslint-disable-line

  // ── Socket listener for real-time new messages ──────────────────────────
  useEffect(() => {
    if (!user?._id) return;

    if (!socketRef.current) {
      socketRef.current = io(BASE_URL, { transports: ["websocket"] });
    }
    const socket = socketRef.current;
    socket.emit("join", user._id);

    const handleReceive = (msg) => {
      const senderId = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
      // Only count if it's someone else's message
      if (String(senderId) !== String(user._id)) {
        setUnreadBySender((prev) => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1,
        }));
      }
    };

    socket.on("receiveMessage", handleReceive);
    return () => { socket.off("receiveMessage", handleReceive); };
  }, [user?._id]); // eslint-disable-line

  // ── Mark all messages from a user as read ───────────────────────────────
  const markRead = async (senderId) => {
    setUnreadBySender((prev) => {
      const next = { ...prev };
      delete next[senderId];
      return next;
    });
    if (!token || !senderId) return;
    try {
      await axios.put(`${BASE_URL}/api/messages/read/${senderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // silent
    }
  };

  const totalUnread = Object.values(unreadBySender).reduce((a, b) => a + b, 0);

  return (
    <UnreadCtx.Provider value={{ totalUnread, unreadBySender, markRead }}>
      {children}
    </UnreadCtx.Provider>
  );
};

export const useUnread = () => useContext(UnreadCtx);
export default UnreadCtx;
