import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { WithNav, WithoutNav } from "./components/outlet";
import Recipes from "./routes/recipes";
import LoginPage from "./routes/login-page";
import Dashboard from "./routes/dashboard";
import Ingredients from "./routes/ingredients";
import Recipe from "./routes/recipe";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route element={<WithoutNav />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<WithNav />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:id" element={<Recipe />} />
          <Route path="/ingredients" element={<Ingredients />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
