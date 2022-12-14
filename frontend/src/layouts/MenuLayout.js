import React from "react";
import SideMenu from "../components/sideMenu";
import { Container } from "react-bootstrap";
import "../styles/MenuLayout.css";

const MenuLayout = ({ children }) => {
  return (
    <div className="App Wrapper" style={{ backgroundColor: "#F9E4CC" }}>
      <div className="sideMenu">
        <SideMenu />
      </div>
      <Container className="content is-open mt-4">{children}</Container>
    </div>
  );
};

export default MenuLayout;
