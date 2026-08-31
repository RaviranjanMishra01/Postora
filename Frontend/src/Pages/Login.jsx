import { useState } from "react";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API;
import validemail from "../lib/regixs";
import { toast } from "react-toastify";
import styles from "../css/pages/Login.module.css";
function Login() {
  const navigate = useNavigate();
  const [userEmail, setUseremail] = useState("");
  const [userPassword, setUserpassword] = useState("");
  
  const getProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      if (!token) return console.log("User not logged in");
      const response = await fetch(`${API}/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      const data = await response.json();
      toast.success(`Welcome ${data.user.name}`, {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/profile");

    } catch (error) {
      toast.error("Failed to fetch profile", {
        position: "top-right",
        autoClose: 3000,
      });
      console.log(` Error fetching profile: ${error.message}`);
    }
  };

  const HandleLogin = async (e) => {
    e.preventDefault();
    if(!userEmail || !userPassword){
      toast.error("Please fill all the fields", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!validemail(userEmail)) {
      toast.error("Please enter a valid email", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        password: userPassword,
      }),
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem("token", data.token);
      toast.success("Login successful", {
        position: "top-right",
        autoClose: 3000,
      });
      await getProfile();
    } else {
      toast.error(data.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    } catch (error) {
      toast.error("An error occurred during login", {
        position: "top-right",
        autoClose: 3000,
      });
      console.log(`Error during login: ${error.message}`);
    }
  };

  return (
    <>
      <div className={styles.login}>
        <form onSubmit={HandleLogin}>
          <input
            type="email"
            value={userEmail}
            placeholder="enter your email"
            onChange={(e) => {
              setUseremail(e.target.value);
            }}
          />
          <input
            type="password"
            value={userPassword}
            onChange={(e) => {
              setUserpassword(e.target.value);
            }}
            placeholder="enter your password"
          />
          <button>Submit</button>
        </form>
      </div>
    </>
  );
}


export default Login;