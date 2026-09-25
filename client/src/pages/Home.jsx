import BlogList from "../components/BlogList";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Newsletter from "../components/Newsletter";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Header />
      <BlogList />
      <Newsletter/>
    </div>
  );
};

export default Home;
