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
import chickenrice from "../images/chicken-rice.jpeg";
import { useNavigate } from "react-router-dom";
import { CheckLg, ChevronLeft } from "react-bootstrap-icons";
import axios from "axios";

const Recipe = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState({});
  const [portion, setPortion] = useState("");
  const [instructions, setInstructions] = useState("test")

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
    if (result <= 0) {
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
          (error) => { }
        );
    }
  };

  const getRecipeInfo = () => {
    return new Promise((resolve, reject) => {
      axios.get("http://localhost:8000/recipeInformation", {
        headers: {
          recipeid: id
        }
      })
        .then((result) => {
          resolve(result.data)
          // console.log(result.data.instructions)
        }).catch((err) => {
          resolve(err)
        })
    })

  }

  const parseStringToHtml = (string) => {
    return <div dangerouslySetInnerHTML={{ __html: string }}></div>
  }

  useEffect(() => {
    setLoading(true);
    // make API call to get recipe information using id

    getRecipeInfo(id)
      .then((result) => {
        setRecipe(result)
        parseStringToHtml(result.instructions)
        setInstructions(parseStringToHtml(result.instructions))
        setLoading(false)
      })
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
      <div className="header1 mb-4">Chicken Rice</div>
      <Card style={cardStyle}>
        <Card.Img src={chickenrice} style={cardImageStyle} />
      </Card>
      <Card style={cardStyle}>
        {loading ? <h2>This is how you prepare chicken rice</h2> : <h2>
          {instructions}
        </h2>}
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
        <Col className="col-2">
          <InputGroup>
            <Form.Control
              aria-label="Number of servings"
              value={portion}
              onChange={onChangeHandler}
            />
            <InputGroup.Text>Portions</InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>
      <Row className="mt-3">
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
      </Row>
    </Container>
  );
};

export default Recipe;
