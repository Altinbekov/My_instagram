import React, { useState } from "react";
import logo from "../img/logo.png";
import "../styles/SignUp.css";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

export default function SignUp() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();

    // Serverga ma'lumotlarni yuborish
    const userData = {
      name: name,
      email: email,
      username: username,
      password: password,
      confirmPassword: confirmPassword,
    };

    fetch("https://insta-clon-beknur.netlify.app//create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.success);
          history.push("/SignIn");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Server bilan bog'lanishda xatolik yuz berdi!");
      });
  };

  return (
    <div className="signup">
      <div className="form-container">
        <form className="form" onSubmit={handleSignUp}>
          <h2>Sign Up</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <button type="submit">Sign Up</button>
          </div>
          <p className="loginPara">
            By signing up, you agree to our Terms,
            <br />
            Privacy Policy, and Cookie Policy.
          </p>
          <hr />
          <div className="form2">
            Already have an account?{" "}
            <Link to="/SignIn">
              <span style={{ color: "blue", cursor: "pointer" }}>Sign In</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
