import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UsersPage } from "./components/pages";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to /users */}
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="/users" element={<UsersPage />} />
      </Routes>
    </BrowserRouter>
  );
}
