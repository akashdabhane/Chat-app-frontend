import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import { AuthProvider } from "./context/Context";
import ProtectedRoute from "./protectedRoutes/ProtectedRoute";
import PageNotFound from './pages/PageNotFound';
import { SkeletonTheme } from 'react-loading-skeleton';


function App() {
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div className="App bg-slate-800 w-[100vw] h-[100vh] overflow-hidden">
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path='*' element={<PageNotFound />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />
              <Route path="/chat/:chatId?" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </div>
    </SkeletonTheme>
  );
}

export default App;
