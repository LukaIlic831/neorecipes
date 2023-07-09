import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const SignUpBlock = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shortPassword, setShortPassword] = useState(false);
  const [userExists, setUserExists] = useState(false);

  const fetchUsers = async () => {
    try {
      await axios
        .get("https://neorecipes.onrender.com/api/users")
        .then((data) => setUsers(data.data));
    } catch (err) {
      console.log(err);
    }
  };

  const userExistsCheck = () => {
    let check = false;
    users.length > 0 &&
      users?.map((user) =>
        user.email === email || user.username === username
          ? (check = true)
          : (check = false)
      );

    return check;
  };

  const signUp = async (e) => {
    try {
      e.preventDefault();
      if (password.length >= 8 && !userExistsCheck()) {
        let id = uuidv4();
        setShortPassword(false);
        setUserExists(false);
        await axios
          .post("https://neorecipes.onrender.com/api/register", {
            id: id,
            username: username,
            email: email,
            password: password,
          })
          .then(() => {
            cookies.set("auth-token", id);
            navigate("/createprofile");
          });
      } else if (password.length < 8) {
        setUserExists(false);
        setShortPassword(true);
      } else {
        setShortPassword(false);
        setUserExists(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="sign-up__block auth__block">
        <div className="sign-up__block--desc auth__block--desc">
          <div className="sign-up__block--title auth__block--title">
            <h2>Register</h2>
          </div>
          {shortPassword && (
            <div className="sign-up__block--err">
              <p>Password should be at least 8 characters</p>
            </div>
          )}
          {userExists && (
            <div className="sign-up__block--err">
              <p>User already exists</p>
            </div>
          )}
          <form
            className="sign-up__block--form auth__block--form"
            onSubmit={(e) => signUp(e)}
          >
            <div className="sign-up__block--input auth__block--input">
              <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="sign-up__block--input auth__block--input">
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="sign-up__block--input auth__block--input">
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="sign-up__block--button auth__block--button">
              <button>REGISTER</button>
            </div>
            <div className="sign-up__block--text auth__block--text">
              <p>
                Already member?
                <span onClick={() => navigate("/signin")}>Sign in</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUpBlock;
