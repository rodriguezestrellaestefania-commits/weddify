import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./pages/Home";
function PrivateRoute({ children }: { children: React.ReactNode }) {
  return localStorage.getItem("token") ? children : <Navigate to="/login" replace />;
}
function PublicOnly({ children }: { children: React.ReactNode }) {
  return localStorage.getItem("token") ? <Navigate to="/" replace /> : children;
}
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
