import Hero from "../components/Hero.jsx";
import Projects from "../components/Projects.jsx";

function HomePage() {
  return (
    <>
      <Hero />
      <Projects limit={3} />
    </>
  );
}

export default HomePage;
