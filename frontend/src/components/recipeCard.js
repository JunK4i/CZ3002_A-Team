import { Card } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RecipeCard = (props) => {
  const navigate = useNavigate();
  const cardStyle = { borderRadius: "30px", height: "12em", width: "12em" };
  const cardImageStyle = {
    objectFit: "cover",
    height: "12em",
    width: "12em",
    borderRadius: "30px",
  };

  const [visible, setVisible] = useState(false);

  return (
    <Card
      style={cardStyle}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={() => {
        navigate(`/recipes/${props.id}`);
      }}
    >
      <Card.Img src={props.img} style={cardImageStyle} />
      {visible && (
        <Card.ImgOverlay
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            borderRadius: "30px",
            height: "12em",
            width: "12em",
            color: "white",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {props.name}
        </Card.ImgOverlay>
      )}
    </Card>
  );
};

export default RecipeCard;
