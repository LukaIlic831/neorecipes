import axios from "axios";
import React, { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { AppContext } from "../../App";

const cookies = new Cookies();

const SignInBlock = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AppContext);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userNotFound, setUserNotFound] = useState(false);

  const signIn = (e) => {
    try {
      e.preventDefault();
      axios
        .post("https://neorecipes.onrender.com/api/login", {
          email: email,
          password: password,
        })
        .then((data) => {
          if (data.data.length !== 0) {
            setUser(data.data[0]);
            cookies.set("auth-token", data.data[0].id);
            localStorage.setItem("userId", cookies.get("auth-token"));
            localStorage.setItem("currentLevel", data.data[0].level);
            navigate("/");
          } else {
            setUserNotFound(true);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="sign-in__block auth__block">
        <div className="sign-in__block--desc auth__block--desc">
          <div className="sign-in__block--title auth__block--title">
            <h2>Login</h2>
          </div>
          {userNotFound && (
            <div className="sign-up__block--err">
              <p>Wrong password or email</p>
            </div>
          )}
          <form
            onSubmit={(e) => signIn(e)}
            className="sign-in__block--form auth__block--form"
          >
            <div className="sign-in__block--input auth__block--input">
              <input
                type="email"
                placeholder="Email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="sign-in__block--input auth__block--input">
              <input
                type="password"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="sign-in__block--button auth__block--button">
              <button>LOGIN</button>
            </div>
            <div className="sign-in__block--text auth__block--text">
              <p>
                Don't have account?
                <span onClick={() => navigate("/signup")}>Sign up</span>now
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignInBlock;
