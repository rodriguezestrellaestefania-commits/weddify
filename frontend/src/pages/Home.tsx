import { useNavigate } from "react-router-dom";
export function Home() {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <div>
      <h1>Home Weddify</h1>
      <button onClick={logout}>Salir</button>
    </div>
  );
}