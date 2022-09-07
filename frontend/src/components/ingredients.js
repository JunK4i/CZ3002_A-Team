import React from "react";
import SideMenu from "../components/sideMenu";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import "../styles/MenuLayout.css";
import "../styles/Typography.css";
import "../styles/Common.css";
/**
 * 
 * @param {*} param0 
 * @returns Page display when the user navigates to ingredients from the home sidemenu. 
 */
const Ingredients = ({ children }) => {
    return (
        <Container>
            <Row className="gy-10" >
                <Col className="col-md-8">
                    <Row className="g-0">
                        <div className="header1">Ingredients</div>
                        <div className="header-caption">Manage your food inventory here</div>
                    </Row>
                </Col>
                <Col className="col-md-4 align-self-end">
                    <button type="button" class="btn btn-warning bt-lg" style={{ textSize: "10px", fontWeight: "bold", height: "45%" }}>
                        <i class="bi-plus-circle-fill"></i> Add Ingredient</button>
                </Col>
            </Row>
            <Row className="white-card gy-10" style={{ marginTop: "20px" }}>
                <div className="white-card-header">
                    <div>Search</div>
                </div>
            </Row>
        </Container >

    );
};

export default Ingredients;
