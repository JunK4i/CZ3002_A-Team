import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Container,
  Button,
  Card,
  Row,
  Col,
  Form,
  InputGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CheckLg, ChevronLeft } from "react-bootstrap-icons";
import axios from "axios";

const Recipe = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState({});
  const [portion, setPortion] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState([]);

  // sets whether the message after clicking the "cooked" button should be showed
  const [showMessage, setShowMessage] = useState(false);

  // sets which message to be shown. true for good message and false for bad message
  const [goodMessage, setGoodMessage] = useState(false);
  let { id } = useParams();

  const cardStyle = { borderRadius: "30px", marginBottom: "2em" };
  const cardImageStyle = {
    objectFit: "cover",
    height: "27em",
    borderRadius: "30px",
  };

  // Only allows numeric inputs into the textfield
  const onChangeHandler = (e) => {
    const result = e.target.value.replace(/\D/g, "");
    setPortion(result);
  };

  const cookedHandler = () => {
    const result = Number(portion);
    console.log(result);
    if (result < 0) {
      setShowMessage(true);
      setGoodMessage(false);
    } else {
      axios
        .put("http://localhost:8000/useRecipe", {
          userid: `${localStorage.getItem("uid")}`,
          recipeid: id,
        })
        .then(
          (response) => {
            if (response.data === "success") {
              setShowMessage(true);
              setGoodMessage(true);
            }
          },
          (error) => {}
        );
    }
  };

  const getRecipeInfo = () => {
    return new Promise((resolve, reject) => {
      axios
        .get("http://localhost:8000/recipeInformation", {
          headers: {
            recipeid: id,
          },
        })
        .then((result) => {
          resolve(result.data);
        })
        .catch((err) => {
          resolve(err);
        });
    });
  };

  const recipeDetailsComponent = () => {
    return (
      <div>
        <h2>Ingredients</h2>
        {ingredients}
        <br></br>
        <h2>Preparation</h2>
        <ol type="1"> {instructions} </ol>
      </div>
    );
  };

  const parseStringToHtml = (string) => {
    return <div dangerouslySetInnerHTML={{ __html: string }}></div>;
  };

  useEffect(() => {
    setLoading(true);
    // make API call to get recipe information using id

    getRecipeInfo(id).then((result) => {
      setRecipe(result);
      let ingredientList = [];
      result.extendedIngredients.forEach((ingredient, index) => {
        ingredientList.push(
          <div key={index} style={{ fontWeight: "normal", fontSize: "20px" }}>
            {ingredient.original}
          </div>
        );
      });
      let cleanInstructions = result.instructions.replace(
        /<\/?[^>]+(>|$)/g,
        ""
      );
      let instructionList = cleanInstructions.split(".");
      let finalInstructionList = [];
      instructionList.forEach((instruction, index) => {
        if (instruction !== "") {
          finalInstructionList.push(
            <li key={index} style={{ fontWeight: "normal", fontSize: "20px" }}>
              {instruction}
            </li>
          );
        }
      });
      setIngredients(ingredientList);
      setInstructions(finalInstructionList);
      setLoading(false);
    });
  }, []);

  return (
    <Container>
      <Button
        variant="btn btn-link text-decoration-none p-0 mb-4"
        onClick={() => navigate("/recipes")}
        style={{ color: "black", fontWeight: "bold" }}
      >
        <ChevronLeft className="pb-1" size={30} />
        Back to Recipes
      </Button>
      <div className="header1 mb-4">{recipe.title}</div>
      <Card style={cardStyle}>
        <Card.Img src={recipe.image} style={cardImageStyle} />
      </Card>
      <Card style={{ ...cardStyle, padding: "1em" }}>
        <h2>{recipeDetailsComponent()}</h2>
      </Card>
      <Row>
        <Col className="col-2">
          <Button
            style={{
              backgroundColor: "#F5963D",
              borderColor: "#F5963D",
              color: "black",
              fontWeight: "bold",
            }}
            size="lg"
            onClick={cookedHandler}
          >
            <CheckLg /> Cooked
          </Button>
        </Col>
        <Col className="col-5">
          {showMessage &&
            (goodMessage ? (
              <div style={{ fontSize: "20px", color: "green" }}>
                Good job! We've deducted the relevant ingredients for you.
              </div>
            ) : (
              <div style={{ fontSize: "20px", color: "red" }}>
                Remember to tell us how many portions you've cooked!
              </div>
            ))}
        </Col>
      </Row>
      <Row className="mt-4 mb-4"></Row>
    </Container>
  );
};

export default Recipe;
