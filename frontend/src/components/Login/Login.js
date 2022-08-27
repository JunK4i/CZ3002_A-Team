import { Col, Container, Row, Button, Form } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import LoginImage from "../../images/login.svg";

const Login = () => {
  return (
    <>
      <Container className="mt-lg-5 mt-2">
        <Row>
          <Col lg={4} md={6} sm={12} className="mt-5 p-3">
            <div className="text-center">
              <PersonCircle color="#00BFA6" size={70} />
            </div>

            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Remember My Password" />
              </Form.Group>
              <div className="d-grid gap-2">
                <Button variant="primary btn-block" type="Login">
                  Submit
                </Button>
              </div>
            </Form>
          </Col>
          <Col lg={8} md={6} sm={12} className="align-middle">
            <img className="w-100" src={LoginImage} alt="login-image" />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
