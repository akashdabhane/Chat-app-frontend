import io from 'socket.io-client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import { AuthProvider } from "./context/Context";
import ProtectedRoute from "./protectedRoutes/ProtectedRoute";
import PageNotFound from './pages/PageNotFound';
const socket = io("https://chatwithmi.vercel.app", {
  withCredentials: true,
});

function App() {

  return (
    <div className="App bg-slate-800 w-[100vw] h-[100vh]">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path='*' element={<PageNotFound />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Chat socket={socket} />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;


