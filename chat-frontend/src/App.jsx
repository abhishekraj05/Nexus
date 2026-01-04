// // src/App.jsx
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // BrowserRouter aur Navigate import karein
// import { useContext } from "react";
// import { AuthContext } from "./context/AuthContext";

// // Components ko import karein
// import Login from "./components/Auth/Login";
// import Register from "./components/Auth/Register";
// import ChatPage from "./pages/ChatPage";
// import Profile from "./pages/Profile"; // Profile page import karein
// import PrivateRoute from "./components/Auth/PrivateRoute"; // Naya PrivateRoute import karein

// function App() {
//   const { user } = useContext(AuthContext);

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public Routes (Login/Register) */}
//         <Route path="/login" element={user ? <Navigate to="/chat" /> : <Login />} />
//         <Route path="/register" element={user ? <Navigate to="/chat" /> : <Register />} />

//         {/* --- Protected Routes --- */}
//         {/* PrivateRoute check karega, agar user hai toh child (ChatPage/Profile) dikhayega */}
//         <Route element={<PrivateRoute />}>
//           <Route path="/chat" element={<ChatPage />} />
//           <Route path="/profile" element={<Profile />} />
//         </Route>
//         {/* ------------------------ */}

//         {/* Default Route */}
//         {/* Agar user '/' par jaaye, toh use /chat (agar logged in hai) ya /login (agar nahi) bhej dein */}
//         <Route path="/" element={<Navigate to={user ? "/chat" : "/login"} replace />} />

//         {/* Koi aur galat URL daale toh login par bhej dein */}
//         <Route path="*" element={<Navigate to="/login" replace />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;





// // src/App.jsx
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useContext } from "react";

// // --- 1. Sabhi Providers aur Components ko import karein ---
// import { AuthContext, AuthProvider } from "./context/AuthContext";
// import { SocketProvider } from "./context/SocketContext";

// import Login from "./components/Auth/Login";
// import Register from "./components/Auth/Register";
// import ChatPage from "./pages/ChatPage";
// import Profile from "./pages/Profile";
// import PrivateRoute from "./components/auth/PrivateRoute";
// // ----------------------------------------------------

// function App() {
//   const { user } = useContext(AuthContext);

//   return (
//     <BrowserRouter>
//       {/* 2. SocketProvider aur CallProvider ko Routes ke bahar rakhein */}
//       <SocketProvider>
//           <Routes>
//             {/* ... (Aapke saare routes waise hi) ... */}
//             <Route path="/login" element={user ? <Navigate to="/chat" /> : <Login />} />
//             <Route path="/register" element={user ? <Navigate to="/chat" /> : <Register />} />
//             <Route element={<PrivateRoute />}>
//               <Route path="/chat" element={<ChatPage />} />
//               <Route path="/profile" element={<Profile />} />
//             </Route>
//             <Route path="/" element={<Navigate to={user ? "/chat" : "/login"} replace />} />
//             <Route path="*" element={<Navigate to="/login" replace />} />
//           </Routes>
//       </SocketProvider>
//     </BrowserRouter>
//   );
// }

// // --- 3. RootApp Component ---
// function RootApp() {
//   return (
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   );
// }

// export default RootApp;



// iske baad main.jsx me changing hai





// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Layouts aur Pages
import MainLayout from './components/Layout/MainContent/MainContent';// <-- Aapka naya layout component
import LandingRoutes from './components/LandingPage/LandingRoutes';
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import NotFound from "./pages/NotFound"; // Ek 404 page (optional)
import ForgotPassword from "./components/Auth/ForgotPassword";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Route 1: Login Page */}
      <Route path="/login" 
        element={user ? <Navigate to="/" /> : <Login />} 
      />
      
      {/* Route 2: Register Page */}
      <Route path="/register" 
        element={user ? <Navigate to="/" /> : <Register />} 
      />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Route 3: Main App (Protected) */}
      {/* Yeh saare routes (/, /friends, /profile) MainLayout ke andar khulenge */}
      {/* <Route path="/*" 
        element={user ? <MainLayout /> : <Navigate to="/login" />} 
      />

      <Route path="/*" element={<LandingRoutes />} /> */}


      <Route 
        path="/*" 
        element={
          user ? (
            // Agar User hai to MainLayout dikhao
                <MainLayout />
          ) : (
            // Agar User nahi hai to Landing Page dikhao
                <LandingRoutes />
          )
        } 
      />
      {/* Route 4: Catch-all (Optional) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;




























