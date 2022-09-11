import React from "react";
import SideMenu from "../components/sideMenu";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/MenuLayout.css";
import "../styles/Typography.css";
import "../styles/Common.css";
import "../styles/Ingredients.css";
import Pagination from "./pagination";
import axios from "axios";
/**
 * @param {*} param0 
 * @returns Page display when the user navigates to ingredients from the home sidemenu. Used in App.js
 */
const Ingredients = ({ children }) => {
    // states 
    const [searchValue, setSearchValue] = React.useState("");
    const [filterValue, setFilterValue] = React.useState("Category");
    const [ingredients, setIngredients] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    // constants
    const categoryList = ["Category", "Dairy", "Meat", "Vegetable", "Fruit", "Grain", "Spice", "Other"];
    const api = axios.create({ baseURL: 'to_be_filled' });
    // hooks
    React.useEffect(() => {
        setIngredients(fakeData.results);
        // getInventory(); disable until backend is ready
    }, []);

    // fake data
    const fakeData = {
        "results": [
            {
                "id": 19400,
                "name": "banana chips",
                "quantity": 23,
                "expiry": "23/10/2022",
                "days_to_expiry": 10,
                "Category": "fruit",
            },
            {
                "id": 93779,
                "name": " liqueur",
                "quantity": 23,
                "expiry": "23/10/2022",
                "days_to_expiry": 3,
                "Category": "fruit",
            },
            {
                "id": 93779,
                "name": " liqueur",
                "quantity": 23,
                "expiry": "23/10/2022",
                "days_to_expiry": 6,
                "Category": "fruit",
            },
            {
                "id": 93779,
                "name": " liqueur",
                "quantity": 23,
                "expiry": "23/10/2022",
                "days_to_expiry": -1,
                "Category": "fruit",
            }
        ],
    }

    async function getInventory() {
        let response = await api.get('/ingredients');
        if (response.status = 200) {
            setIngredients(response.data);
        } else {
            console.log("response", response);
        }
    }

    // callback passed into pagination component
    function handlePageChange(newPage) {
        setCurrentPage(newPage);
    }

    return (
        <Container>
            <Row>
                <Col className="col-md-10">
                    <Row>
                        <div className="header1">Ingredients</div>
                        <div className="header-caption">Manage your food inventory here</div>
                    </Row>
                </Col>
                <Col className="col-md-2 align-self-end flex justify-content-center">
                    <button type="button" className="btn btn-warning" style={{ textSize: "10px", fontWeight: "bold", height: "45%", width: "70%" }}>
                        <i className="bi-plus-circle-fill"></i> Add Ingredient</button>
                </Col>
            </Row>
            <div className="white-card gx-3" style={{ marginTop: "20px" }}>
                <Row style={{ padding: "15px 10px 5px 10px" }}>
                    <Col className="col-md-5">
                        <div>
                            <div className="input-group">
                                <input type="text" placeholder="Search..." className="form-control" aria-label="Sizing example input"
                                    aria-describedby="inputGroup-sizing-default" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                            </div>
                        </div>
                    </Col>
                    <Col className="col-md-5">
                        <div>
                            <div className="input-group">
                                <span className="input-group-text" id="inputGroup-sizing-sm">Filter</span>
                                <select className="form-select" aria-label="Select Filter" value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
                                    {categoryList.map((category, index) => <option key={index}>{category}</option>)}
                                </select>
                            </div>
                        </div>
                    </Col>
                    <Col className="align-self-center">
                        <Pagination currentPage={currentPage} totalCount={700} pageSize={10} onPageChange={(handlePageChange)} />
                    </Col>
                </Row>
                <div className="ingredients-grid">
                    <div className="ingredients-row-wrapper">
                        <div>Ingredient</div> <div>Category</div> <div>Servings</div> <div>Purchase Date</div> <div>Days to Expiry</div> <div><i className="bi-gear"></i></div>
                    </div>
                    {ingredients.map((ingredient, index) => {
                        ingredient.name = ingredient.name.trim()
                        ingredient.name = ingredient.name[0].toUpperCase() + ingredient.name.slice(1);
                        ingredient.Category = ingredient.Category[0].toUpperCase() + ingredient.Category.slice(1);
                        let status = "";
                        if (ingredient.days_to_expiry < 0) {
                            status = "expired";
                        } else if (ingredient.days_to_expiry <= 3) {
                            status = "expiring-fast";
                        } else if (ingredient.days_to_expiry <= 7) {
                            status = "expiring";
                        }

                        return (
                            <div key={index} className={`ingredients-row-wrapper ${status}`}>
                                <div>{ingredient.name}</div>
                                <div>{ingredient.Category}</div>
                                <div>{ingredient.quantity}</div>
                                <div>{ingredient.expiry}</div>
                                <div>{ingredient.days_to_expiry}</div>
                                <div className="rotate-90"><i className="bi-three-dots"></i></div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Container >

    );
};

export default Ingredients;
