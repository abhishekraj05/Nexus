// src/RootApp.jsx
import React from 'react';
// import { BrowserRouter } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext"; // Maan raha hoon yeh file hai
import App from './App'; // <-- Ab App component ko import karein

// Yeh component Providers ko setup karta hai
export default function RootApp() {
  return (
    <AuthProvider> {/* <-- Provider #1: Ab 'user' har jagah available hoga */}
      <SocketProvider> {/* <-- Provider #2 */}
        {/* <BrowserRouter>  */}
        <HashRouter>
          <App />
        </HashRouter>
        {/* </BrowserRouter> */}
      </SocketProvider>
    </AuthProvider>
  );
}