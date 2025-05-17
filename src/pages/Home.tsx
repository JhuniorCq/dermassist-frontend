import { Link } from "react-router-dom";
import homeBackground from "../assets/images/homeBackground.jpg";

const Home = () => {
  return (
    <section className="w-full min-h-screen flex items-center justify-center">
      <img
        className="w-full h-screen fixed"
        src={homeBackground}
        alt="Background"
      />
      <div className="shadow-lg px-6 py-3 bg-white absolute">
        <h1 className="text-3xl font-bold">SECCIONES</h1>

        <ul>
          <li>
            <Link to="/registro">Registro</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Home;

// Safamos este componente creo
