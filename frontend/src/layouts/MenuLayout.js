import React from "react";
import SideMenu from "../components/sideMenu";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "../styles/MenuLayout.css";

const MenuLayout = ({ children }) => {
  return (
    <div className="App Wrapper" style={{ backgroundColor: "#F9E4CC" }}>
      <SideMenu />
      <Container className="content">{children}</Container>
    </div>
  );
};

export default MenuLayout;
