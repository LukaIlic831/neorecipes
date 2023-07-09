import Home from "./pages/home";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Recipe from "./pages/recipe";
import SignInPage from "./pages/sign in page";
import SignUpPage from "./pages/sign up page";
import SearchPage from "./pages/search page";
import CreateProfile from "./pages/create profile";
import { useEffect, useState, createContext } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import AddRecipe from "./pages/add recipe";
import Profile from "./pages/profile";
import EditRecipe from "./pages/edit recipe";

const cookies = new Cookies();
export const AppContext = createContext(null);

function App() {
  const [user, setUser] = useState();
  const [levelChanged, setLevelChanged] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const fetchUser = async () => {
    if (cookies.get("auth-token")) {
      await axios
        .get(`https://neorecipes.onrender.com/api/user/${cookies.get("auth-token")}`)
        .then((data) => {
          if (
            +localStorage.currentLevel !== data.data[0].level &&
            +localStorage.currentLevel &&
            localStorage.userId === cookies.get("auth-token")
          ) {
            setLevelChanged(true);
          }
          localStorage.setItem("userId", cookies.get("auth-token"));
          localStorage.setItem("currentLevel", data.data[0].level);
          setUser(data.data[0]);
        });
    }
  };

  useEffect(() => {
    fetchUser();
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <>
      <Router>
        <AppContext.Provider
          value={{
            user,
            setUser,
            fetchUser,
            levelChanged,
            setLevelChanged,
            windowWidth,
          }}
        >
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/recipes/:id" element={<Recipe />}></Route>
            <Route path="/signin" element={<SignInPage />}></Route>
            <Route path="/signup" element={<SignUpPage />}></Route>
            <Route path="/createprofile" element={<CreateProfile />}></Route>
            <Route path="/search" element={<SearchPage />}></Route>
            <Route path="/add-recipe" element={<AddRecipe />}></Route>
            <Route path="/edit-recipe/:id" element={<EditRecipe />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
          </Routes>
        </AppContext.Provider>
      </Router>
    </>
  );
}

export default App;
