import { useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  InputGroup,
  Form,
  Spinner,
  Button,
} from "react-bootstrap";
import Pagination from "../components/pagination";
import { Search } from "react-bootstrap-icons";
import RecipeCard from "../components/recipeCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Recipes = () => {
  const navigate = useNavigate();

  // Styles for the cards
  const cardStyle = { borderRadius: "30px", height: "23em" };
  const cardImageStyle = {
    objectFit: "cover",
    height: "23em",
    borderRadius: "30px",
    cursor: "pointer",
  };

  // States
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [generatedRecipesLoading, setGeneratedRecipesLoading] = useState(true);

  const [recommendedRecipe, setRecommendedRecipe] = useState({});
  const [recipeOfTheDay, setRecipeOfTheDay] = useState({
    id: 638125,
    title: "Chicken In A Pot",
    imageType: "jpg",
    image: "https://spoonacular.com/recipeImages/638125-312x231.jpg",
  });

  const [generatedRecipesPage, setGeneratedRecipesPage] = useState(1);
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [displayedGeneratedRecipes, setDisplayedGeneratedRecipes] = useState(
    []
  );
  const [noRecommendedRecipes, setNoRecommendedRecipes] = useState(false);
  const [generatedRecipesTotalResults, setGeneratedRecipesTotalResults] =
    useState(0);

  const [searchRecipesPage, setSearchRecipesPage] = useState(1);
  const [searchRecipeValue, setSearchRecipeValue] = useState("");
  const [searchRecipesResults, setSearchRecipesResults] = useState([]);
  const [searchRecipesTotalPages, setSearchRecipesTotalPages] = useState(0);

  // Handlers
  const generatedRecipesPageHandler = (nextPage) => {
    const nextRecipes = Object.entries(generatedRecipes)
      .slice((nextPage - 1) * 10, (nextPage - 1) * 10 + 10)
      .map((entry) => entry[1]);
    console.log(nextRecipes);
    setDisplayedGeneratedRecipes(nextRecipes);
    setGeneratedRecipesPage(nextPage);
  };

  const recipeSearchPageHandler = (nextPage) => {
    setSearchRecipesPage(nextPage);
    axios
      .get("http://localhost:8000/searchRecipe", {
        headers: {
          query: searchRecipeValue,
          offset: (nextPage - 1) * 10,
        },
      })
      .then(
        (response) => {
          setSearchRecipesTotalPages(response.data["totalResults"]);
          setSearchRecipesResults(response.data["results"]);
          localStorage.setItem(
            "searchedRecipes",
            JSON.stringify(response.data["results"])
          );
          localStorage.setItem("searchRecipePage", nextPage);
        },
        (error) => {}
      );
  };

  const generatedReceipesSearchHandler = (e) => {
    if (e.target.value === "") {
      setDisplayedGeneratedRecipes(
        Object.entries(generatedRecipes)
          .slice(
            (generatedRecipesPage - 1) * 10,
            (generatedRecipesPage - 1) * 10 + 10
          )
          .map((entry) => entry[1])
      );
    } else {
      let filteredDisplayedRecipes = [];
      const originalRecipes = Object.entries(generatedRecipes)
        .slice(
          (generatedRecipesPage - 1) * 10,
          (generatedRecipesPage - 1) * 10 + 10
        )
        .map((entry) => entry[1]);
      for (let i = 0; i < originalRecipes.length; i++) {
        if (
          originalRecipes[i].title
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        ) {
          filteredDisplayedRecipes.push(originalRecipes[i]);
        }
      }
      setDisplayedGeneratedRecipes(filteredDisplayedRecipes);
    }
  };

  const searchRecipeSubmitHandler = () => {
    setSearchLoading(true);
    localStorage.setItem("scrollPosition", window.pageYOffset);
    axios
      .get("http://localhost:8000/searchRecipe", {
        headers: {
          query: searchRecipeValue,
          offset: 0,
        },
      })
      .then(
        (response) => {
          setSearchRecipesTotalPages(response.data["totalResults"]);
          setSearchRecipesResults(response.data["results"]);
          localStorage.setItem(
            "searchedRecipes",
            JSON.stringify(response.data["results"])
          );
          localStorage.setItem("searchedPages", response.data["totalResults"]);
          localStorage.setItem("searchRecipeValue", searchRecipeValue);
          localStorage.setItem("searchRecipePage", 1);
          setSearchLoading(false);
        },
        (error) => {}
      );
  };

  const searchKeyDownHandler = (e) => {
    if (e.key === "Enter") {
      searchRecipeSubmitHandler();
    }
  };

  const handleScrollPosition = () => {
    const scrollPosition = localStorage.getItem("scrollPosition");
    if (scrollPosition) {
      window.scrollTo(0, scrollPosition);
      localStorage.removeItem("scrollPosition");
    }
  };

  useEffect(() => {
    setLoading(true);
    const uid = localStorage.getItem("uid");
    if (!uid) {
      navigate("/login");
    }
    setGeneratedRecipesLoading(true);
    // make api call to get first page of recommended recipes
    axios
      .get("http://localhost:8000/recommendRecipe", {
        headers: {
          userid: uid,
        },
      })
      .then(
        (response) => {
          console.log(response);
          if (response["data"].error === true) {
            setNoRecommendedRecipes(true);
            setGeneratedRecipesLoading(false);
          } else {
            let totalResults = Object.keys(response["data"]).length;
            setGeneratedRecipes(response["data"]);
            setGeneratedRecipesTotalResults(totalResults);
            if (totalResults <= 10) {
              setDisplayedGeneratedRecipes(response["data"]);
            } else {
              setDisplayedGeneratedRecipes(
                Object.entries(response["data"])
                  .slice(0, 10)
                  .map((entry) => entry[1])
              );
            }
            setRecommendedRecipe(response["data"][0]);
            setRecipeOfTheDay(response["data"][1]);
            setGeneratedRecipesLoading(false);
          }
        },
        (error) => {}
      );

    if (localStorage.getItem("searchRecipeValue") != null) {
      setSearchRecipeValue(localStorage.getItem("searchRecipeValue"));
    }

    if (localStorage.getItem("searchedRecipes") != null) {
      setSearchRecipesResults(
        JSON.parse(localStorage.getItem("searchedRecipes"))
      );
    }

    if (localStorage.getItem("searchRecipePage") != null) {
      setSearchRecipesPage(localStorage.getItem("searchRecipePage"));
    }

    if (localStorage.getItem("searchedPages") != null) {
      setSearchRecipesTotalPages(localStorage.getItem("searchedPages"));
    }

    handleScrollPosition();

    setLoading(false);
  }, []);

  return (
    <Container>
      <div className="header1">Recipes</div>
      <div className="header-caption mb-3">Generate your recipes here!</div>
      <Row>
        <Col>
          <h2>Recipe of the Day </h2>
          <Card
            style={cardStyle}
            onClick={() => {
              navigate(`/recipes/${recipeOfTheDay.id}`);
            }}
          >
            {loading ? (
              <Spinner />
            ) : (
              <Card.Img
                src={recipeOfTheDay.image}
                alt="Recipe of the Day"
                style={cardImageStyle}
              />
            )}
          </Card>
        </Col>
        <Col>
          <h2>Recommended Recipe</h2>
          <Card
            style={cardStyle}
            onClick={() => {
              navigate(`/recipes/${recommendedRecipe.id}`);
            }}
          >
            {console.log(loading)}
            {loading ? (
              <Spinner animation="border" />
            ) : noRecommendedRecipes ? (
              <div style={{ padding: "15px" }}>
                You have no ingredients! Add some ingredients so we can
                recommend you a recipe!
              </div>
            ) : (
              <Card.Img
                src={recommendedRecipe.image}
                alt="Recommended Recipe"
                style={cardImageStyle}
              />
            )}
          </Card>
        </Col>
      </Row>
      <Row>
        <Card
          style={{
            ...cardStyle,
            marginTop: "2em",
            padding: "15px",
            height: "536px",
          }}
        >
          <Row>
            <Col>
              <Card.Title>Recipes Based on Your Ingredients</Card.Title>
            </Col>
            <Col className="col col-2">
              <Pagination
                currentPage={generatedRecipesPage}
                totalCount={generatedRecipesTotalResults}
                pageSize={10}
                onPageChange={generatedRecipesPageHandler}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col className="col col-4">
              <InputGroup>
                <InputGroup.Text id="search-1">
                  <Search />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search"
                  aria-label="generated-recipes-search"
                  aria-describedby="search-1"
                  onChange={generatedReceipesSearchHandler}
                />
              </InputGroup>
            </Col>
          </Row>
          {generatedRecipesLoading ? (
            <Spinner animation="border" />
          ) : noRecommendedRecipes ? (
            <div>
              You have no ingredients! Add some ingredients so that we can
              recommend you some recipes.
            </div>
          ) : (
            <Row xs={1} md={5} className="mb-4">
              {console.log(displayedGeneratedRecipes)}
              {displayedGeneratedRecipes.map((_, idx) => (
                <Col
                  className="col d-flex justify-content-center mt-2"
                  key={idx}
                >
                  <RecipeCard
                    key={displayedGeneratedRecipes[idx].id}
                    img={displayedGeneratedRecipes[idx].image}
                    name={displayedGeneratedRecipes[idx].title}
                    id={displayedGeneratedRecipes[idx].id}
                  />
                </Col>
              ))}
            </Row>
          )}
        </Card>
      </Row>
      <Row>
        <Card
          style={{
            ...cardStyle,
            marginTop: "2em",
            padding: "15px",
            height: "506px",
            marginBottom: "2em",
          }}
        >
          <Row>
            <Col>
              <Card.Title>Search for any Recipe</Card.Title>
            </Col>
            <Col>
              <InputGroup>
                <InputGroup.Text id="search-2">
                  <Search />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search for a Recipe"
                  aria-label="search-all-recipes"
                  aria-describedby="search-2"
                  onChange={(e) => setSearchRecipeValue(e.target.value)}
                  onKeyDown={searchKeyDownHandler}
                  value={searchRecipeValue}
                />
              </InputGroup>
            </Col>
            <Col>
              <Button
                onClick={searchRecipeSubmitHandler}
                style={{
                  backgroundColor: "#F5963D",
                  borderColor: "#F5963D",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                Search
              </Button>
            </Col>
            <Col>
              <Pagination
                currentPage={searchRecipesPage}
                totalCount={searchRecipesTotalPages}
                pageSize={10}
                onPageChange={recipeSearchPageHandler}
              />
            </Col>
          </Row>
          <Row xs={1} md={5} className="mb-4">
            {searchRecipesResults.map((_, idx) => (
              <Col className="col d-flex justify-content-center mt-4">
                <RecipeCard
                  img={searchRecipesResults[idx].image}
                  name={searchRecipesResults[idx].title}
                  id={searchRecipesResults[idx].id}
                  key={searchRecipesResults[idx].id}
                />
              </Col>
            ))}
          </Row>
        </Card>
      </Row>
    </Container>
  );
};

export default Recipes;
