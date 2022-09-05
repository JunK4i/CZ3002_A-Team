import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import MenuLayout from "../layouts/MenuLayout";
import Login from "../components/login";

function App() {
  return (
    <MenuLayout>
      <Login />
    </MenuLayout>
  );
}

export default App;
