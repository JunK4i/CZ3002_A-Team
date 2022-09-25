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
  const cardStyle = { borderRadius: "30px" };
  const cardImageStyle = {
    objectFit: "cover",
    height: "23em",
    borderRadius: "30px",
  };

  // States
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [generatedRecipesLoading, setGeneratedRecipesLoading] = useState(false);
  const [generatedRecipesOffset, setGeneratedRecipesOffset] = useState(0);

  const [recommendedRecipe, setRecommendedRecipe] = useState({});
  const [recipeOfTheDay, setRecipeOfTheDay] = useState({});

  const [generatedRecipesPage, setGeneratedRecipesPage] = useState(1);
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [displayedGeneratedRecipes, setDisplayedGeneratedRecipes] = useState(
    []
  );
  const [generatedRecipesTotalPages, setGeneratedRecipesTotalPages] =
    useState(0);

  const [searchRecipesPage, setSearchRecipesPage] = useState(1);
  const [searchRecipeValue, setSearchRecipeValue] = useState("");
  const [searchRecipesResults, setSearchRecipesResults] = useState([]);
  const [searchRecipesTotalPages, setSearchRecipesTotalPages] = useState(0);

  // Handlers
  const generatedRecipesPageHandler = (nextPage) => {
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
      setDisplayedGeneratedRecipes(generatedRecipes);
    } else {
      let filteredDisplayedRecipes = [];
      for (let i = 0; i < generatedRecipes.length; i++) {
        if (
          generatedRecipes[i].title
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        ) {
          filteredDisplayedRecipes.push(generatedRecipes[i]);
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
          console.log(response);
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

  // Dummy Fake Data
  const fakeGeneratedRecipes = {
    offset: 0,
    number: 2,
    results: [
      {
        id: 716429,
        title: "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs",
        image: "https://spoonacular.com/recipeImages/716429-312x231.jpg",
        imageType: "jpg",
      },
      {
        id: 715538,
        title:
          "What to make for dinner tonight?? Bruschetta Style Pork & Pasta",
        image: "https://spoonacular.com/recipeImages/715538-312x231.jpg",
        imageType: "jpg",
      },
      {
        id: 715538,
        title:
          "What to make for dinner tonight?? Bruschetta Style Pork & Pasta",
        image: "https://spoonacular.com/recipeImages/715538-312x231.jpg",
        imageType: "jpg",
      },
      {
        id: 715538,
        title:
          "What to make for dinner tonight?? Bruschetta Style Pork & Pasta",
        image: "https://spoonacular.com/recipeImages/715538-312x231.jpg",
        imageType: "jpg",
      },
      {
        id: 715538,
        title:
          "What to make for dinner tonight?? Bruschetta Style Pork & Pasta",
        image: "https://spoonacular.com/recipeImages/715538-312x231.jpg",
        imageType: "jpg",
      },
      {
        id: 715538,
        title:
          "What to make for dinner tonight?? Bruschetta Style Pork & Pasta",
        image: "https://spoonacular.com/recipeImages/715538-312x231.jpg",
        imageType: "jpg",
      },
      {
        id: 715538,
        title:
          "What to make for dinner tonight?? Bruschetta Style Pork & Pasta",
        image: "https://spoonacular.com/recipeImages/715538-312x231.jpg",
        imageType: "jpg",
      },
      {
        id: 715538,
        title:
          "What to make for dinner tonight?? Bruschetta Style Pork & Pasta",
        image: "https://spoonacular.com/recipeImages/715538-312x231.jpg",
        imageType: "jpg",
      },
      {
        id: 715538,
        title:
          "What to make for dinner tonight?? Bruschetta Style Pork & Pasta",
        image: "https://spoonacular.com/recipeImages/715538-312x231.jpg",
        imageType: "jpg",
      },
      {
        id: 715538,
        title:
          "What to make for dinner tonight?? Bruschetta Style Pork & Pasta",
        image: "https://spoonacular.com/recipeImages/715538-312x231.jpg",
        imageType: "jpg",
      },
    ],
    totalResults: 86,
  };

  useEffect(() => {
    setLoading(true);
    setGeneratedRecipesLoading(true);
    // make api call to get first page of recommended recipes
    // axios
    //   .get("http://localhost:8000/recommendRecipe", {
    //     headers: {
    //       userid: `${localStorage.getItem("uid")}`,
    //       offset: generatedRecipesOffset,
    //     },
    //   })
    //   .then(
    //     (response) => {
    //       console.log(response);
    //       setDisplayedGeneratedRecipes(response["results"]);
    //       setGeneratedRecipesTotalPages(response["totalResults"]);
    //       setRecommendedRecipe(response["results"][0]);
    //       setRecipeOfTheDay(response["results"][1]);
    //     },
    //     (error) => {}
    //   );
    const data = fakeGeneratedRecipes;
    setGeneratedRecipes(data.results);
    setDisplayedGeneratedRecipes(data.results);
    setGeneratedRecipesTotalPages(data.totalResults);
    // take index 0 of result to be recommended recipes
    setRecommendedRecipe(data.results[0]);
    // take index 1 of result to be recipe of the day
    setRecipeOfTheDay(data.results[1]);
    setGeneratedRecipesLoading(false);

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
          <h2>Recommended Recipes</h2>
          <Card
            style={cardStyle}
            onClick={() => {
              navigate(`/recipes/${recommendedRecipe.id}`);
            }}
          >
            {loading ? (
              <Spinner />
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
                totalCount={generatedRecipesTotalPages}
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
          <Row xs={1} md={5} className="mb-4">
            {generatedRecipesLoading ? (
              <Spinner />
            ) : (
              displayedGeneratedRecipes.map((_, idx) => (
                <Col className="col d-flex justify-content-center mt-2">
                  <RecipeCard
                    img={displayedGeneratedRecipes[idx].image}
                    name={displayedGeneratedRecipes[idx].title}
                    id={displayedGeneratedRecipes[idx].id}
                  />
                </Col>
              ))
            )}
          </Row>
        </Card>
      </Row>
      <Row>
        <Card
          style={{
            ...cardStyle,
            marginTop: "2em",
            padding: "15px",
            height: "506px",
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
                  placeholder="Search"
                  aria-label="search-all-recipes"
                  aria-describedby="search-2"
                  onChange={(e) => setSearchRecipeValue(e.target.value)}
                  onKeyDown={searchKeyDownHandler}
                  value={searchRecipeValue}
                />
              </InputGroup>
            </Col>
            <Col>
              <Button onClick={searchRecipeSubmitHandler}>Search</Button>
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
