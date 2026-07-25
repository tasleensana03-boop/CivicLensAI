import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

function Home() {
  return (
    <div style={{ minHeight: "100vh", width: "100%", backgroundColor: "#020617", color: "white" }}>
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}

export default Home;
