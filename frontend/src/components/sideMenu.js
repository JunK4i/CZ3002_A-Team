import { React, useState } from "react";
import { Nav, Button } from "react-bootstrap";
import "../styles/MenuLayout.css";
import {
  HouseDoorFill,
  FileEarmarkTextFill,
  ArchiveFill,
} from "react-bootstrap-icons";
import { auth } from "../FirebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate, NavLink } from "react-router-dom";

const SideMenu = (props) => {
  const [active, setActive] = useState("dashboard");
  const navigate = useNavigate();
  const logoutHandler = () => {
    signOut(auth).then(() => {
      navigate("/login");
    });
  };

  const selectHandler = (eventKey) => {
    setActive(eventKey);
    console.log(eventKey);
  };

  return (
    <div className="sidebar is-open">
      <div className="sidebar-header">
        <h3>Recipely</h3>
      </div>

      <Nav className="flex-column pt-2" onSelect={selectHandler}>
        <Nav.Item className={active === "dashboard" ? "active" : ""}>
          <Nav.Link to="/dashboard" eventKey="dashboard" as={NavLink}>
            <HouseDoorFill /> Dashboard
          </Nav.Link>
        </Nav.Item>

        <Nav.Item className={active === "ingredients" ? "active" : ""}>
          <Nav.Link to="/ingredients" eventKey="ingredients" as={NavLink}>
            <ArchiveFill /> Ingredients
          </Nav.Link>
        </Nav.Item>

        <Nav.Item className={active === "recipes" ? "active" : ""}>
          <Nav.Link to="/recipes" eventKey="recipes" as={NavLink}>
            <FileEarmarkTextFill /> Recipes
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <Button variant="btn btn-blk ml-3" onClick={logoutHandler}>
        Log Out
      </Button>
    </div>
  );
};

export default SideMenu;
