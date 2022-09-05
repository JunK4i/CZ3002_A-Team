import { React, useState } from "react";
import { Nav, Button } from "react-bootstrap";
import "../styles/MenuLayout.css";
import {
  HouseDoorFill,
  FileEarmarkTextFill,
  ArchiveFill,
} from "react-bootstrap-icons";

const SideMenu = (props) => {
  return (
    <div className="sidebar is-open">
      <div className="sidebar-header">
        <h3>Recipely</h3>
      </div>

      <Nav className="flex-column pt-2" style={{ textDecoration: "none" }}>
        <Nav.Item className="active">
          <Nav.Link href="/">
            <HouseDoorFill /> Dashboard
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link href="/" className="nav-link">
            <ArchiveFill /> Ingredients
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link href="/">
            <FileEarmarkTextFill /> Recipes
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <Button className="align-self-end">Log Out</Button>
    </div>
  );
};

export default SideMenu;
