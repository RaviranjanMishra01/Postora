import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import validemail from "../lib/regixs";
const API = import.meta.env.VITE_API;


function Register() {
  const navigate = useNavigate();
  const [userName, setUsername] = useState("");
  const [userEmail, setUseremail] = useState("");
  const [userPassword, setUserpassword] = useState("");

  const HandleRegister = async (e) => {
    e.preventDefault();
    try {
      if (!userName || !userEmail || !userPassword) {
         toast.error("Please fill all the fields", {
         position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      if (userName.length < 3) {
        toast.error("Username must be at least 3 characters", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      if (userPassword.length < 6) {
        toast.error("Password must be at least 6 characters", {
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

      const response = await fetch(`${API}/register`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          user: userName,
          password: userPassword,
          email: userEmail,
        }),
      });
      const data = await response.json();
      toast.success(data.message, {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login")
    } catch (error) {
      toast.error("An error occurred during registration", {
        position: "top-right",
        autoClose: 3000,
      });
      console.log("error while connect with profile ",error);
    }
  };
  return (
    <>
      <div className="registaion">
        <form
          onSubmit={HandleRegister}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            marginTop: "15px",
          }}
        >
          <input
            style={{ padding: "10px 15px" }}
            type="text"
            value={userName}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="enter your username"
          />
          <input
            style={{ padding: "10px 15px" }}
            type="email"
            value={userEmail}
            onChange={(e) => {
              setUseremail(e.target.value);
            }}
            placeholder="enter your email"
          />
          <input
            style={{ padding: "10px 15px" }}
            type="password"
            value={userPassword}
            onChange={(e) => {
              setUserpassword(e.target.value);
            }}
            placeholder="enter your password"
          />
          <input
            style={{ padding: "10px 15px" }}
            type="reset"
            onClick={() => {
              (setUseremail(""), setUsername(""), setUserpassword(""));
            }}
          />
          <input style={{ padding: "10px 15px" }} type="submit" />
        </form>
      </div>
    </>
  );
}

export default Register;
