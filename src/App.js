import { useState } from "react";
import io from 'socket.io-client';
import Cookies from "js-cookie";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Chat from "./pages/Chat";
import { Context } from "./context/Context";
import PageNotFound from './pages/PageNotFound';
const socket = io("http://localhost:9000");

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState("");
  const [email, setEmail] = useState(''); 

  return (
    <div className="App bg-slate-800">
      <Context.Provider value={{ isLogin, setIsLogin, socket, user, setUser, email, setEmail }}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={ Cookies.get('isLogin') === 'true' ? <Chat /> : <Login />}  />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </Context.Provider>
    </div>
  );
}

export default App;


