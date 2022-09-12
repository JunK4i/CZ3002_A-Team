import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { WithNav, WithoutNav } from "./components/outlet";
import Test from "./routes/recipes";
import LoginPage from "./routes/login-page";
import Dashboard from "./routes/dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route element={<WithoutNav />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<WithNav />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recipes" element={<Test />} />
          <Route path="/ingredients" element={<Test />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
