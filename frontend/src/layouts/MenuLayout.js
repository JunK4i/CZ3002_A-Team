import React from "react";
import SideMenu from "../components/sideMenu";
import { Container } from "react-bootstrap";
import "../styles/MenuLayout.css";

const MenuLayout = ({ children }) => {
  return (
    <div className="App Wrapper" style={{ backgroundColor: "#F9E4CC" }}>
      <SideMenu />
      <Container className="content is-open">{children}</Container>
    </div>
  );
};

export default MenuLayout;
