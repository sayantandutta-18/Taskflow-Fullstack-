import Navbar from "../components/layout/Navbar";
import Hero from "../components/ui/Hero";
import Footer from "../components/layout/Footer";
import Features from "../components/ui/Features"; 

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features/>
      <Footer />
    </>
  );
}

export default Home;