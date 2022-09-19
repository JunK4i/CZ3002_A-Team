import { React, useState } from "react";
import { Nav, Button, Row, Col } from "react-bootstrap";
import "../styles/MenuLayout.css";
import {
  HouseDoorFill,
  FileEarmarkTextFill,
  ArchiveFill,
} from "react-bootstrap-icons";
import { auth } from "../FirebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate, NavLink } from "react-router-dom";
import Logo from "../images/logo.svg";

const SideMenu = (props) => {
  const [active, setActive] = useState(
    localStorage.getItem("active") == null
      ? "dashboard"
      : localStorage.getItem("active")
  );
  const navigate = useNavigate();
  const logoutHandler = () => {
    signOut(auth).then(() => {
      localStorage.removeItem("uid");
      navigate("/login");
    });
  };

  const selectHandler = (eventKey) => {
    setActive(eventKey);
    localStorage.setItem("active", eventKey);
    localStorage.removeItem("searchRecipeValue");
    localStorage.removeItem("searchedRecipes");
    localStorage.removeItem("searchedPages");
    localStorage.removeItem("searchRecipePage");
  };

  return (
    <div className="sidebar is-open">
      <div className="sidebar-header">
        <Row className="pl-3">
          <Col
            className="d-flex flex-wrap align-items-center col-2"
            md={{ offset: 1 }}
          >
            <div className="ml-3">
              <img
                src={Logo}
                alt="recipely logo"
                style={{ width: "60px", height: "60px" }}
              />
            </div>
          </Col>
          <Col className="">
            <h3>Recipely</h3>
          </Col>
        </Row>
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
