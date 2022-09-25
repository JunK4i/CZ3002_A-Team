import { Form, Button, Spinner } from "react-bootstrap";
import { createUserWithEmailAndPassword } from "firebase/auth";
import * as Yup from "yup";
import { Formik } from "formik";
import { auth } from "../FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ChevronLeft } from "react-bootstrap-icons";

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
        axios
          .post("http://localhost:8000/newuser", {
            userid: `${userCredential.user.uid}`,
            name: `${values.name}`,
          })
          .then(
            (response) => {
              if (response.data === "success") {
                localStorage.setItem("uid", userCredential.user.uid);
                navigate("/dashboard");
                setSubmitting(false);
              }
            },
            (error) => {
              console.log(error);
              setFieldError(
                "name",
                "Please check your connection and try again."
              );
              setSubmitting(false);
            }
          );
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
      >
        <Button
          variant="btn btn-link text-decoration-none p-0 mb-4"
          onClick={props.onClickHandler}
          style={{ color: "black" }}
        >
          <ChevronLeft className="pb-1" size={30} />
          Back to Login
        </Button>

        <div className="header1 mb-3">Sign Up</div>
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
                <Form.Label className="fw-bold">Name</Form.Label>
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
                <Form.Label className="fw-bold">Email</Form.Label>
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
                <Form.Label className="fw-bold">Password</Form.Label>
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
                <Form.Label className="fw-bold">Confirm Password</Form.Label>
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
                  variant="primary btn-block"
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: "#F5963D",
                    borderColor: "#F5963D",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  {isSubmitting ? <Spinner animation="border" /> : "Sign Up"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </AnimatePresence>
  );
};

export default SignUp;
