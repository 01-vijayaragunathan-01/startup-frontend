import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Chat from "./Pages/Chat";
import MentorProfile from "./Pages/MentorProfile";
import Register from "./Pages/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./Pages/About";
import MentorList from "./components/MentorList";
import Trends from "./Pages/Trends";
import MyProfile from "./Pages/MyProfile";
import PrivateRoute from "./components/PrivateRoute";
import ChatPage from "./Pages/ChatPage";
import Wm from "./Pages/Wm";
import MarketTrends from "./Pages/MarketTrends";
import AddResource from "./Pages/AddResource";
// import ProfileUpdate from "./Pages/ProfileUpdate";


const App = () => {
  return (
    <div>
      <Navbar />
      <Wm />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mentor-list" element={<MentorList />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/chat/" element={<Chat />} /> */}
        <Route path="/chat" element={<ChatPage />} />
        <Route
          path="/my-profile"
          element={
            <PrivateRoute>
              <MyProfile />
            </PrivateRoute>
          }
        />
        <Route path="/resources" element={<MarketTrends />} />
        <Route path="/add-resource" element={<AddResource />} />
        {/* <Route path="/profile-update" element={<ProfileUpdate />} /> */}
        <Route path="/trends" element={<Trends />} />
        <Route path="/chat/:mentorId" element={<Chat />} />
        <Route path="/mentor/:id" element={<MentorProfile />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
