import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import { AuthProvider } from "./context/Context";
import ProtectedRoute from "./protectedRoutes/ProtectedRoute";
import PageNotFound from './pages/PageNotFound';
import { useEffect, useState } from "react";
import LeftPanel from "./components/LeftPanel";
import RightSideMainChatPanel from "./components/RightSideMainChatPanel";
import { SkeletonTheme } from 'react-loading-skeleton';


function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust as per your mobile breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize); // Add resize listener

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div className="App bg-slate-800 w-[100vw] h-[100vh]">
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path='*' element={<PageNotFound />} />
              <Route path="/" element={
                <ProtectedRoute>
                  {isMobile ? <LeftPanel /> : <Chat />}
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  {isMobile ? <RightSideMainChatPanel /> : <Chat />}
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
