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
      <Container className="mt-lg-5 mt-2">
        <Row>
          <Col lg={4} md={6} sm={12} className="mt-5 p-3">
            <div className="text-center">
              <PersonCircle color="#00BFA6" size={70} />
            </div>
            {signUp ? (
              <SignUp onClickHandler={loginPageHandler} />
            ) : (
              <Login onClickHandler={signUpPageHandler} />
            )}
          </Col>
          <Col lg={8} md={6} sm={12} className="align-middle">
            <img className="w-100" src={LoginImage} alt="login-image" />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LoginPage;
