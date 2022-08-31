import { Form, Button, Spinner } from "react-bootstrap";
import { createUserWithEmailAndPassword } from "firebase/auth";
import * as Yup from "yup";
import { Formik } from "formik";
import { auth } from "../FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const schema = Yup.object().shape({
  name: Yup.string()
    .max(30, "Name is too long!")
    .required("Please provide your name."),
  email: Yup.string()
    .required("Please provide your email.")
    .matches(
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Please provide a valid email."
    ),
  password: Yup.string()
    .required("Please provide your password.")
    .min(6, "Password has to be at least 6 characters."),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match."
  ),
});

const SignUp = (props) => {
  const navigate = useNavigate();

  const submitHandler = (values, { setSubmitting, setFieldError }) => {
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Post data to backend
        navigate("/");
        setSubmitting(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        switch (errorCode) {
          case "auth/email-already-in-use":
            setFieldError("email", "Email already in use.");
            break;
          case "auth/network-request-failed":
            setFieldError(
              "name",
              "Please check your connection and try again."
            );
        }
        setSubmitting(false);
      });
  };

  return (
    <AnimatePresence>
      <motion.div
        key="signup"
        initial={{ x: -100, opacity: 1 }}
        animate={{ x: 0, opacity: 1 }}
        // exit={{ x: -100, opacity: 0 }}
      >
        <Formik
          validationSchema={schema}
          validateOnChange={false}
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={submitHandler}
        >
          {({ handleChange, values, isSubmitting, errors, handleSubmit }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="signupName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="signupEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="Enter Email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="signupPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="Enter Password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="signupConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="Re-enter Password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  isInvalid={!!errors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-grid gap-2 mt-4">
                <Button
                  variant="primary btn-block p-3"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Spinner animation="border" /> : "Sign Up"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
        <Button
          variant="btn btn-link text-decoration-none p-0 mt-1"
          onClick={props.onClickHandler}
        >
          Sign in instead
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};

export default SignUp;
