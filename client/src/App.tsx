import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UsersPage, StreamsPage } from "./components/pages";
import { ROUTES } from "./routes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to /users */}
        <Route
          path={ROUTES.HOME}
          element={<Navigate to={ROUTES.USERS} replace />}
        />
        <Route path={ROUTES.USERS} element={<UsersPage />} />
        <Route path={ROUTES.STREAMS} element={<StreamsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
