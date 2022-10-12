import { Col, Container, Row, Toast, ToastContainer } from "react-bootstrap";
import LoginImage from "../images/login.svg";
import { useEffect, useState } from "react";
import Login from "../components/login";
import SignUp from "../components/signup";
import RecipelyLogo from "../images/recipely.png";

const LoginPage = () => {
  const [signUp, setSignUp] = useState(false);
  const [showVerificationToast, setShowVerificationToast] = useState(false);

  const signUpPageHandler = () => {
    setSignUp(true);
  };

  const loginPageHandler = () => {
    setSignUp(false);
  };

  const redirectFromSignUpHandler = () => {
    setSignUp(false);
    setShowVerificationToast(true);
  };

  const toastToggler = () => {
    setShowVerificationToast(!showVerificationToast);
  };

  return (
    <>
      <Container fluid className="" style={{ height: "100vh" }}>
        <Row style={{ height: "100vh" }}>
          <Col className="">
            <img src={RecipelyLogo} alt="recipely-logo" />

            <div style={{ padding: "175px" }}>
              {signUp ? (
                <SignUp
                  onClickHandler={loginPageHandler}
                  redirectHandler={redirectFromSignUpHandler}
                />
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
        <ToastContainer className="p-3" position={"bottom-center"}>
          <Toast show={showVerificationToast} onClose={toastToggler}>
            <Toast.Header closeButton={true}>
              <strong className="me-auto">Account Created!</strong>
            </Toast.Header>
            <Toast.Body>
              An email has been sent to your email address to verify your
              account. You can only log in after verifying your account!
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </>
  );
};

export default LoginPage;
