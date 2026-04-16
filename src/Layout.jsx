// src/Layout.jsx
import { Outlet, useNavigate, useLocation } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";
import LoginPage from "../src/pages/authPages/LoginPage";
import useAuth from "./Hooks/UseAuth";
import FloatingAI from "./pages/commonPages/servicePages.jsx/FloatingAI";
import RealtimeChat from "./pages/commonPages/servicePages.jsx/WhatsAppChat";

const Layout = () => {
  const { ready, user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Global loading spinner
  if (!ready) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-600"></div>
      </div>
    );
  }

  // Hide Back on home & login
  const noBackPaths = ["/", "/login"];
  const showBack = !noBackPaths.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header + optional Back button in one relative container */}
      <div className="relative z-20">
        <Header />
        <LoginPage />

        {showBack && (
          <>
            {/* -------- non-logged-in back, always visible -------- */}
            {!user && (
              <button
                onClick={() => navigate(-1)}
                className="absolute top-[100px] left-4 flex items-center text-teal-600 hover:text-teal-700 p-1 bg-transparent"
              >
                <FaArrowLeft className="mr-1" size={16} />
                <span className="text-sm font-medium">Back</span>
              </button>
            )}

            {/* -------- logged-in back on mobile (100px) -------- */}
            {user && (
              <button
                onClick={() => navigate(-1)}
                className="lg:hidden absolute top-[85px] left-4 flex items-center text-teal-600 hover:text-teal-700 p-1 bg-transparent"
              >
                <FaArrowLeft className="mr-1" size={16} />
                <span className="text-sm font-medium">Back</span>
              </button>
            )}

            {/* -------- logged-in back on desktop (180px) -------- */}
            {user && (
              <button
                onClick={() => navigate(-1)}
                className="hidden lg:flex absolute top-[180px] left-4  items-center text-teal-600 hover:text-teal-700 p-1 bg-transparent"
              >
                <FaArrowLeft className="mr-1" size={16} />
                <span className="text-sm font-medium">Back</span>
              </button>
            )}
          </>
        )}
      </div>

      {/* Page content */}
      <main className="flex-grow">
        <Outlet />
        <FloatingAI />
        <RealtimeChat />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
