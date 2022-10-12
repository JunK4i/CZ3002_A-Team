import React from "react";
import SideMenu from "../components/sideMenu";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/MenuLayout.css";
import "../styles/Typography.css";
import "../styles/Common.css";
import "../styles/Ingredients.css";
import Pagination from "../components/pagination";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";

/**
 * @param {*} param0
 * @returns Page display when the user navigates to ingredients from the home sidemenu. Used in App.js
 */
const Ingredients = ({ children }) => {
  const navigate = useNavigate();
  // states
  const [searchValue, setSearchValue] = React.useState("");
  const [filterValue, setFilterValue] = React.useState("Category");
  const [data, setData] = React.useState([]);
  const [ingredients, setIngredients] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const categoryList =
    ["Category",
      "Dairy",
      "Meat",
      "Vegetable",
      "Fruit",
      "Grain",
      "Spice",
      "Other",
    ];
  const [searchType, setSearchType] = React.useState(["", "", "", ""]); // [safe,expiring,expiring-fast,expired]
  const [optionsOpen, setOptionsOpen] = React.useState([]); // array of booleans to keep track of which row option is open
  const [addOpen, setAddOpen] = React.useState(false);
  const [addSearchValue, setAddSearchValue] = React.useState("");
  const [addSearchResults, setAddSearchResults] = React.useState([]);
  const [addIngredient, setAddIngredient] = React.useState("");
  const [addServings, setAddServings] = React.useState();
  const [addExpiry, setAddExpiry] = React.useState("");
  const [addCategory, setAddCategory] = React.useState("Dairy");
  const [selectedIngredient, setSelectedIngredient] = React.useState("");
  const [consumeOpen, setConsumeOpen] = React.useState(false);
  const [consumeServings, setConsumeServings] = React.useState();
  const [throwOpen, setThrowOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editServings, setEditServings] = React.useState();
  const [editExpiryDate, setEditExpiryDate] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const uid = "xtDKw9PlJxXZFPo53RDvF884Cde2"
  // localStorage.getItem("uid");
  const defaultCategories = [
    "Dairy",
    "Meat",
    "Vegetable",
    "Fruit",
    "Grain",
    "Spice",
    "Other",
  ];

  // constants
  const api = axios.create({ baseURL: "http://localhost:8000" });
  // hooks
  React.useEffect(() => {
    if (!uid) {
      navigate("/login");
    }
    getInventory();
  }, []);

  React.useEffect(() => {
    filterSearch();
  }, [searchValue, filterValue, searchType]);

  React.useEffect(() => { }, [addIngredient]);

  // fetch functions
  async function getInventory() {
    let response = await api.get("/ingredient", {
      headers: {
        userid: uid,
      },
    });
    if (response.status === 200) {
      if (response.data !== undefined) {
        let data = response.data;
        data.sort((a, b) => {
          return a.days_to_expiry - b.days_to_expiry;
        });
        data.forEach((ingredient) => {
          ingredient.expiry = moment(ingredient.expiry).format("DD/MM/YYYY");
        });
        setData(data);
        setIngredients(data);
        setOptionsOpen(Array(data.length).fill(false));
      }
    } else {
    }
  }

  // submit functions
  async function handleSubmitIngredient(e) {
    console.log("submitting ingredient", uid, addIngredient, addServings, addExpiry, addCategory);
    if (uid && addIngredient && addServings && addExpiry && addCategory) {
      setIsLoading(true);
      let response = await api.post("/ingredient", {
        userid: uid,
        ingredientid: addIngredient.id,
        quantity: addServings,
        expiry: addExpiry,
        name: addIngredient.name,
        category: addCategory,
      });
      getInventory();
      setIsLoading(false);
      setAddOpen(false);
      setAddSearchValue("");
      setAddIngredient(null);
      setAddServings();
      setAddExpiry("");
    } else {
      setIsError(true);
    }
  }

  async function handleSubmitConsume(e) {
    if (consumeServings && ingredients[selectedIngredient]) {
      if (
        parseInt(consumeServings) ===
        parseInt(ingredients[selectedIngredient].quantity)
      ) {
        // delete
        setIsLoading(true);
        let response = await api.delete("/ingredient", {
          data: {
            userid: uid, //req.body.userid, req.body.id
            id: ingredients[selectedIngredient].id,
          },
        });
        getInventory();
        setConsumeServings(null);
        setIsLoading(false);
        setConsumeOpen(false);
      } else {
        // edit
        setIsLoading(true);
        let response = await api.put("/ingredient", {
          ...ingredients[selectedIngredient],
          userid: uid,
          quantity: ingredients[selectedIngredient].quantity - consumeServings,
          expiry: moment(
            ingredients[selectedIngredient].expiry,
            "DD/MM/YYYY"
          ).format("YYYY-MM-DD"),
        });
        getInventory();
        setConsumeServings(null);
        setIsLoading(false);
        setConsumeOpen(false);
      }
    } else {
      setIsError(true);
    }
  }

  async function handleSubmitEdit(e) {
    if (editExpiryDate && editServings && ingredients[selectedIngredient]) {
      setIsLoading(true);
      let response = await api.put("/ingredient", {
        ...ingredients[selectedIngredient],
        userid: uid,
        quantity: parseInt(editServings),
        expiry: editExpiryDate,
      });
      getInventory();
      setEditExpiryDate(null);
      setEditServings(null);
      setIsLoading(false);
      setEditOpen(false);
    } else {
      setIsError(true);
    }
  }

  async function handleSubmitThrow(e) {
    let response = await api.delete("/discardIngredient", {
      data: {
        userid: uid, //req.body.userid, req.body.id
        id: ingredients[selectedIngredient].id,
      },
    });
    getInventory();
    setThrowOpen(false);
  }

  // event handlers
  function handleClickDots(e, index) {
    e.preventDefault();
    let newOptionsOpen = Array(optionsOpen.length).fill(false); // close everything
    newOptionsOpen[index] = !optionsOpen[index]; // toggle the one clicked
    setOptionsOpen(newOptionsOpen);
  }

  // callback passed into pagination component
  function handlePageChange(newPage) {
    setCurrentPage(newPage);
  }

  function handleAddIngredient(e) {
    setAddSearchValue(e.target.value); // for type values
    addSearchResults.forEach((ingredient) => {
      if (ingredient.name === e.target.value) {
        setAddIngredient(ingredient);
        return;
      }
    });
  }

  function handleConsume(e, index) {
    setSelectedIngredient(index);
    setConsumeOpen(true);
  }

  function handleThrowAway(e, index) {
    setThrowOpen(true);
    setSelectedIngredient(index);
  }

  function handleEditServings(e, index) {
    setEditOpen(true);
    setSelectedIngredient(index);
    setEditServings(ingredients[index].quantity);
    setEditExpiryDate(
      moment(ingredients[index].expiry, "DD/MM/YYYY").format("YYYY-MM-DD")
    );
  }

  async function handleEnterSearch(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      let response = await api.get("/searchingredient", {
        headers: {
          query: addSearchValue,
          offset: 0, // just get first 10
        },
      });
      if (response.status === 200) {
        setAddSearchResults(response.data.results);
      }
    }
  }

  async function handleClickSearch(e) {
    let response = await api.get("/searchingredient", {
      headers: {
        query: addSearchValue,
        offset: 0, // just get first 10
      },
    });
    if (response.status === 200) {
      setAddSearchResults(response.data.results);
    }
  }

  function filterSearch() {
    try {
      if (
        (searchValue === "" || searchValue === null) &&
        searchValue === "Category"
      ) {
        setIngredients(data);
      }
      let search = searchValue.toLowerCase();
      let filteredList = data.filter((ingredient) => {
        // return ingredient.category === filterValue;
        if (filterValue === "Category") {
          return ingredient.name.toLowerCase().includes(search);
        } else if (searchValue === "") {
          return ingredient.category === filterValue;
        } else {
          return (
            ingredient.name.toLowerCase().includes(search) &&
            ingredient.category === filterValue
          );
        }
      });

      let [safe, expiring, expiring_soon, expired] = [[], [], [], []];
      if (searchType[0] === "selected") {
        safe = filteredList.filter((ingredient) => {
          return ingredient.days_to_expiry > 7;
        })
      }
      if (searchType[1] === "selected") {
        expiring = filteredList.filter((ingredient) => {
          return ingredient.days_to_expiry <= 7 && ingredient.days_to_expiry > 3;
        })
      }
      if (searchType[2] === "selected") {
        expiring_soon = filteredList.filter((ingredient) => {
          return ingredient.days_to_expiry <= 3 && ingredient.days_to_expiry >= 0;
        })
      }
      if (searchType[3] === "selected") {
        expired = filteredList.filter((ingredient) => {
          return ingredient.days_to_expiry < 0;
        })
      }
      let b = ["", "", "", ""];
      if (searchType.find((v, i) => v !== b[i]) === undefined) {
        setIngredients(filteredList);
      } else {
        setIngredients([...safe, ...expiring, ...expiring_soon, ...expired])
      }
    } catch (e) {
      console.log("error filtering", e);
    }
  }

  function handleFilterChange(e) {
    setFilterValue(e.target.value);
  }

  // UI components
  function renderError() {
    <div className="dialog">
      <div className="dialog-mask"></div>
      <div className="alert alert-danger" role="alert">
        Error
        <i
          className="x-button bi-x-square"
          onClick={(e) => {
            setIsError(false);
          }}
        ></i>
      </div>
    </div>;
  }

  function renderAddDialog() {
    return (
      <div className="dialog">
        <div className="dialog-mask"></div>
        <div className="dialog-card">
          <i
            className="x-button bi-x-square"
            onClick={(e) => {
              setAddOpen(false);
              setAddSearchValue("");
              setAddIngredient(null);
              setAddServings();
              setAddExpiry("");
            }}
          ></i>
          <div className="dialog-header text-bold">Add Ingredient</div>
          <div
            className="white-card"
            style={{ marginTop: "10px", padding: "15px" }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="form-group">
                <label for="ingredient-name" className="text-bold">
                  Ingredient Name
                </label>
                <div class="input-group mb-3">
                  <input
                    id="ingredient-name"
                    type="text"
                    placeholder="Search Ingredient..."
                    className="form-control"
                    aria-label="Sizing example input"
                    list="datalistOptions"
                    aria-describedby="inputGroup-sizing-default"
                    value={addSearchValue}
                    onChange={(e) => {
                      handleAddIngredient(e);
                    }}
                    onKeyDown={handleEnterSearch}
                    required
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    id="button-addon1"
                    onClick={handleClickSearch}
                  >
                    <i className="bi-search"></i>
                  </button>
                  <datalist id="datalistOptions">
                    {addSearchResults.map((item, index) => (
                      <option value={item.name} key={index}>
                        {item.name}
                      </option>
                    ))}
                  </datalist>
                </div>
              </div>
              <label for="Category" className="text-bold">
                Category
              </label>
              <div className="input-group">
                <select
                  id="Category"
                  className="form-select"
                  value={addCategory}
                  onChange={(e) => setAddCategory(e.target.value)}
                  required
                >
                  {defaultCategories.map((category, index) => (
                    <option value={category} key={index}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginTop: "15px" }}>
                <label for="servings" className="text-bold">
                  Servings
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="servings"
                  placeholder="Enter Amount"
                  value={addServings}
                  onChange={(e) => setAddServings(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ marginTop: "15px" }}>
                <label for="expiry-date" className="text-bold">
                  Expiry Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="expiry-date"
                  placeholder="Enter Expiry Date"
                  value={addExpiry}
                  onChange={(e) => setAddExpiry(e.target.value)}
                  required
                />
              </div>
              <div
                style={{
                  display: "grid",
                  placeItems: "center",
                  paddingTop: "15px",
                }}
              >
                <button
                  onClick={handleSubmitIngredient}
                  type="submit"
                  className="btn btn-warning"
                  style={{
                    textSize: "10px",
                    fontWeight: "bold",
                    height: "100%",
                    width: "60%",
                  }}
                >
                  {isLoading ? (
                    <div
                      className="spinner-border text-secondary"
                      role="status"
                    ></div>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  function renderConsume() {
    let max = ingredients[selectedIngredient].quantity;
    return (
      <div className="dialog">
        <div className="dialog-mask"></div>
        <div className="dialog-card">
          <i
            className="x-button bi-x-square"
            onClick={(e) => {
              setConsumeOpen(false);
              setConsumeServings();
            }}
          ></i>
          <div className="dialog-header text-bold">{`Consume ${ingredients[selectedIngredient]["name"]}`}</div>
          <div className="white-card" style={{ marginTop: "10px" }}>
            <form style={{ padding: "15px" }}>
              <div className="form-group">
                <label
                  for="servings"
                  className="text-bold"
                >{`Servings (max: ${max})`}</label>
                <input
                  type="number"
                  className="form-control"
                  id="servings"
                  placeholder="Enter Amount"
                  value={consumeServings}
                  onChange={(e) => setConsumeServings(e.target.value)}
                  min="0"
                  max={`${max}`}
                />
              </div>
            </form>
            <div
              style={{
                display: "grid",
                placeItems: "center",
                paddingBottom: "15px",
              }}
            >
              {consumeServings > max || consumeServings < 0 ? (
                <div className="alert alert-danger" role="alert">
                  Servings must be less than or equal to {max}
                </div>
              ) : (
                <button
                  onClick={handleSubmitConsume}
                  type="submit"
                  className="btn btn-warning"
                  style={{
                    textSize: "10px",
                    fontWeight: "bold",
                    height: "100%",
                    width: "60%",
                  }}
                >
                  {isLoading ? (
                    <div
                      className="spinner-border text-primary"
                      role="status"
                    ></div>
                  ) : (
                    "Confirm"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderThrowaway() {
    return (
      <div className="dialog">
        <div className="dialog-mask"></div>
        <div className="dialog-card">
          <i
            className="x-button bi-x-square"
            onClick={(e) => {
              setThrowOpen(false);
            }}
          ></i>
          <div className="dialog-header text-bold">{`Throwaway ${ingredients[selectedIngredient]["name"]}`}</div>
          <div className="white-card" style={{ marginTop: "10px" }}>
            <div
              style={{
                display: "grid",
                placeItems: "center",
                padding: "15px 0px",
              }}
            >
              <button
                onClick={handleSubmitThrow}
                type="submit"
                className="btn btn-warning"
                style={{
                  textSize: "10px",
                  fontWeight: "bold",
                  height: "100%",
                  width: "60%",
                }}
              >
                {isLoading ? (
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderEdit() {
    return (
      <div className="dialog">
        <div className="dialog-mask"></div>
        <div className="dialog-card">
          <i
            className="x-button bi-x-square"
            onClick={(e) => {
              setEditOpen(false);
              setEditServings();
              setEditExpiryDate();
            }}
          ></i>
          <div className="dialog-header text-bold">{`Edit ${ingredients[selectedIngredient]["name"]}`}</div>
          <div className="white-card" style={{ marginTop: "10px" }}>
            <form style={{ padding: "15px" }}>
              <div className="form-group" style={{ marginTop: "15px" }}>
                <label for="servings" className="text-bold">
                  Servings
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="servings"
                  placeholder="Enter Amount"
                  value={editServings}
                  onChange={(e) => setEditServings(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ marginTop: "15px" }}>
                <label for="expiry-date" className="text-bold">
                  Expiry Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="expiry-date"
                  placeholder="Enter Expiry Date"
                  value={editExpiryDate}
                  onChange={(e) => setEditExpiryDate(e.target.value)}
                  required
                />
              </div>
            </form>
            <div
              style={{
                display: "grid",
                placeItems: "center",
                paddingBottom: "15px",
              }}
            >
              <button
                onClick={handleSubmitEdit}
                type="submit"
                className="btn btn-warning"
                style={{
                  textSize: "10px",
                  fontWeight: "bold",
                  height: "100%",
                  width: "60%",
                }}
              >
                {isLoading ? (
                  <div
                    className="spinner-border text-secondary"
                    role="status"
                  ></div>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <Container>
      {addOpen && renderAddDialog()}
      {throwOpen && renderThrowaway()}
      {consumeOpen && renderConsume()}
      {editOpen && renderEdit()}
      {isError && renderError()}
      <Row>
        <Col className="col-md-10">
          <Row>
            <div className="header1">Ingredients</div>
            <div className="header-caption">
              Manage your food inventory here
            </div>
          </Row>
        </Col>
        <Col className="col-md-2 align-self-end flex justify-content-center">
          <button
            onClick={(e) => {
              setAddOpen(true);
            }}
            type="button"
            className="btn btn-warning"
            style={{
              textSize: "10px",
              fontWeight: "bold",
              height: "45%",
              width: "fit-content",
            }}
          >
            <i className="bi-plus-circle-fill"></i> Add Ingredient
          </button>
        </Col>
      </Row>
      <div className="white-card gx-3" style={{ marginTop: "20px" }}>
        <Row style={{ padding: "15px 10px" }}>
          <Col className="col-md-5">
            <div>
              <div className="input-group">
                <span className="input-group-text" id="inputGroup-sizing-sm">
                  <i className="bi-search"></i>
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                />
              </div>
            </div>
          </Col>
          <Col className="col-md-5">
            <div className="input-group">
              <span className="input-group-text" id="inputGroup-sizing-sm">
                Filter
              </span>
              <select
                className="form-select"
                aria-label="Select Filter"
                onChange={(e) => handleFilterChange(e)}
              >
                {categoryList.map((category, index) => (
                  <option value={category} key={index}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </Col>
          <Col className="align-self-center">
            <Pagination
              currentPage={currentPage}
              totalCount={ingredients.length}
              pageSize={20}
              onPageChange={handlePageChange}
            />
          </Col>
        </Row>
        <div className="legend">
          <div className={`legend-item ${searchType[3]}`} onClick={e => {
            let array = [...searchType];
            if (searchType[3] === "selected") {
              array[3] = "";
              setSearchType(array);
            } else {
              array[3] = "selected";
              setSearchType(array);
            }
          }}>
            <div className="legend-circle" style={{ backgroundColor: "#7c453c" }}></div>
            Expired
          </div>
          <div className={`legend-item ${searchType[2]}`} onClick={e => {
            let array = [...searchType];
            if (searchType[2] === "selected") {
              array[2] = "";
              setSearchType(array);
            } else {
              array[2] = "selected";
              setSearchType(array);
            }
          }}>
            <div className="legend-circle" style={{ backgroundColor: "#DA2E2E" }} ></div>
            Expiring in 3 days
          </div>
          <div className={`legend-item ${searchType[1]}`} onClick={e => {
            let array = [...searchType];
            if (searchType[1] === "selected") {
              array[1] = "";
              setSearchType(array);
            } else {
              array[1] = "selected";
              setSearchType(array);
            }
          }}>
            <div className="legend-circle" style={{ backgroundColor: "#E5A706" }}></div>
            Expring in 7 days
          </div>
          <div className={`legend-item ${searchType[0]}`} onClick={e => {
            let array = [...searchType];
            if (searchType[0] === "selected") {
              array[0] = "";
              setSearchType(array);
            } else {
              array[0] = "selected";
              setSearchType(array);
            }
          }}>
            <div className="legend-circle" style={{ backgroundColor: "black" }}></div>
            Safe to consume
          </div>
        </div>
        <div className="ingredients-grid">
          <div className="ingredients-row-wrapper">
            <div>Ingredient</div> <div>Category</div> <div>Servings</div>{" "}
            <div>Date of Expiry</div> <div>Days to Expiry</div>{" "}
            <div>
              <i className="bi-gear"></i>
            </div>
          </div>
          {ingredients !== [] &&
            ingredients.map((ingredient, index) => {
              try {
                ingredient.name = ingredient.name.trim();
                ingredient.name =
                  ingredient.name[0].toUpperCase() + ingredient.name.slice(1);
                ingredient.category =
                  ingredient.category[0].toUpperCase() +
                  ingredient.category.slice(1);
                let status = "";
                if (ingredient.days_to_expiry < 0) {
                  status = "expired";
                } else if (ingredient.days_to_expiry <= 3) {
                  status = "expiring-fast";
                } else if (ingredient.days_to_expiry <= 7) {
                  status = "expiring";
                }
                if ((index < currentPage * 20) && (index >= (currentPage - 1) * 20)) {
                  return (
                    <div
                      key={index}
                      className={`ingredients-row-wrapper ${status}`}
                    >
                      <div>{ingredient.name}</div>
                      <div>{ingredient.category}</div>
                      <div>{ingredient.quantity}</div>
                      <div>{ingredient.expiry}</div>
                      <div>{ingredient.days_to_expiry}</div>
                      <div
                        className="ingredients-icon"
                        onClick={(e) => handleClickDots(e, index)}
                      >
                        <div className="rotate-90">
                          <i className="bi-three-dots"></i>
                        </div>
                        {optionsOpen[index] && (
                          <div className="ingredients-options-wrapper">
                            <div className="ingredients-options">
                              <div
                                className="ingredients-option"
                                onClick={(e) => handleConsume(e, index)}
                              >
                                Consume
                              </div>
                              <div
                                className="ingredients-option"
                                onClick={(e) => handleThrowAway(e, index)}
                              >
                                Throw Away
                              </div>
                              <div
                                className="ingredients-option"
                                onClick={(e) => handleEditServings(e, index)}
                              >
                                Edit Servings
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              } catch {
                return null;
              }
            })}
        </div>
      </div>
    </Container>
  );
};

export default Ingredients;
