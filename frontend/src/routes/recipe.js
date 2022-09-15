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

const Recipe = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState({});
  let { id } = useParams();

  const cardStyle = { borderRadius: "30px", marginBottom: "2em" };
  const cardImageStyle = {
    objectFit: "cover",
    height: "27em",
    borderRadius: "30px",
  };

  useEffect(() => {
    setLoading(true);
    // make API call to get recipe information using id
  }, []);

  return (
    <Container>
      <Button onClick={() => navigate("/recipes")}>Back to Recipes</Button>
      <h1>Chicken Rice</h1>
      <Card style={cardStyle}>
        <Card.Img src={chickenrice} style={cardImageStyle} />
      </Card>
      <Card style={cardStyle}>
        <h2>This is how you prepare chicken rice </h2>
      </Card>
      <Row>
        <Col className="col-3">
          <InputGroup>
            <Form.Control aria-label="Number of servings" />
            <InputGroup.Text>Servings</InputGroup.Text>
            <Button>Cooked</Button>
          </InputGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Recipe;
