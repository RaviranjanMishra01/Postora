import { BrowserRouter,Routes,Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import Home from "./Pages/Home";
import Navbar from "./components/Navbar";
import CreateBlog from "./Pages/Create-blog";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";
function App() {
  return <>
      <BrowserRouter>
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
        <Routes>
            {/* Home page */}
            <Route 
                path="/"
                element={
                    <Home />
                }
            />
            {/* Login */}
            <Route 
                path="/login"
                element={
                    <PublicRoute><Login /></PublicRoute>
                }    
            />
            {/* Register */}
            <Route
                path="/register"
                element={
                    <PublicRoute><Register/></PublicRoute>
                } 
            />
            {/* Profile */}
            <Route 
                path="/profile"
                element={
                    <PrivateRoute> <Profile /> </PrivateRoute>
                }
            />
            {/* Create Blog */}
            <Route
                path="/create-blog"
                element={
                    <PrivateRoute>
                        <CreateBlog />
                    </PrivateRoute>
                }
            />
        </Routes>
      </BrowserRouter>
  </>
}
export default App
