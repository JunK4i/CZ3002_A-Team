import { Col, Container, Row } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import LoginImage from "../images/login.svg";
import { useState } from "react";
import Login from "../components/login";
import SignUp from "../components/signup";

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
          <Col className="mt-5 align-items-center">
            <div className="text-center">
              <PersonCircle color="#00BFA6" size={70} />
            </div>
            {signUp ? (
              <SignUp onClickHandler={loginPageHandler} />
            ) : (
              <Login onClickHandler={signUpPageHandler} />
            )}
          </Col>
          <Col className="d-flex flex-wrap align-items-center">
            <img
              className=""
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
