import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setTokenState] = useState(() => localStorage.getItem("token"));
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");

  const setToken = (nextToken) => {
    setTokenState(nextToken);

    if (nextToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${nextToken}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/api/blog/all");

      data.success ? setBlogs(data.blogs) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  useEffect(() => {
    const loadBlogs = async () => {
      await fetchBlogs();
    };

    loadBlogs();
  }, []);

  const value = {
    axios,
    navigate,
    token,
    setToken,
    blogs,
    setBlogs,
    input,
    setInput,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// This hook intentionally shares the context from the provider in this module.
// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  return useContext(AppContext);
};
