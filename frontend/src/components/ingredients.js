import React from "react";
import SideMenu from "../components/sideMenu";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/MenuLayout.css";
import "../styles/Typography.css";
import "../styles/Common.css";
import Pagination from "./pagination";
/**
 * @param {*} param0 
 * @returns Page display when the user navigates to ingredients from the home sidemenu. Used in App.js
 */
const Ingredients = ({ children }) => {
    const [searchValue, setSearchValue] = React.useState("");
    const [filterValue, setFilterValue] = React.useState("Category");
    const [currentPage, setCurrentPage] = React.useState(1);

    function handlePageChange(newPage) {
        setCurrentPage(newPage);
    }

    return (
        <Container>
            <Row>
                <Col className="col-md-8">
                    <Row>
                        <div className="header1">Ingredients</div>
                        <div className="header-caption">Manage your food inventory here</div>
                    </Row>
                </Col>
                <Col className="col-md-4 align-self-end">
                    <button type="button" className="btn btn-warning" style={{ textSize: "10px", fontWeight: "bold", height: "45%", width: "100%" }}>
                        <i className="bi-plus-circle-fill"></i> Add Ingredient</button>
                </Col>
            </Row>
            <Row className="white-card gx-3" style={{ marginTop: "20px" }}>
                <Col className="col-md-4">
                    <div className="white-card-header">
                        <div className="input-group">
                            <input type="text" placeholder="Search..." className="form-control" aria-label="Sizing example input"
                                aria-describedby="inputGroup-sizing-default" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                        </div>
                    </div>
                </Col>
                <Col className="col-md-5">
                    <div className="white-card-header">
                        <div className="input-group">
                            <span className="input-group-text" id="inputGroup-sizing-sm">Filter</span>
                            <select className="form-select" aria-label="Select Filter" value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
                                <option value="">Open this select menu</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                        </div>
                    </div>
                </Col>
                <Col className="col-md-3 align-self-center justify-content-end">
                    <Pagination currentPage={currentPage} totalCount={700} pageSize={10} onPageChange={(handlePageChange)} />
                </Col>
            </Row>
        </Container >

    );
};

export default Ingredients;
