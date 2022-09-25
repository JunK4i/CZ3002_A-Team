import { Col, Container, Row } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import LoginImage from "../images/login.svg";
import { useState } from "react";
import Login from "../components/login";
import SignUp from "../components/signup";
import RecipelyLogo from "../images/recipely.png";

const LoginPage = () => {
  const [signUp, setSignUp] = useState(false);

  const signUpPageHandler = () => {
    setSignUp(true);
  };

  const loginPageHandler = () => {
    setSignUp(false);
  };

  return (
    <>
      <Container fluid className="" style={{ height: "100vh" }}>
        <Row style={{ height: "100vh" }}>
          <Col className="">
            <img src={RecipelyLogo} alt="recipely-logo" />

            <div style={{ padding: "175px" }}>
              {signUp ? (
                <SignUp onClickHandler={loginPageHandler} />
              ) : (
                <Login onClickHandler={signUpPageHandler} />
              )}
            </div>
          </Col>
          <Col
            className="d-flex flex-wrap align-items-center"
            style={{ backgroundColor: "#F9E4CC" }}
          >
            <img
              src={LoginImage}
              alt="login-image"
              style={{ width: "100%", height: "80%" }}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LoginPage;
