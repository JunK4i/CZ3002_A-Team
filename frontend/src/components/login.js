import React from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import * as Yup from "yup";
import { Formik } from "formik";
import { auth } from "../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const schema = Yup.object().shape({
  email: Yup.string()
    .required("Please provide your email.")
    .matches(
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Please provide a valid email."
    ),
  password: Yup.string()
    .required("Please provide your password.")
    .min(6, "Password has to be at least 6 characters."),
});

const Login = (props) => {
  const navigate = useNavigate();

  const submitHandler = (values, { setSubmitting, setFieldError }) => {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Go into app
        navigate("/");
        setSubmitting(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        switch (errorCode) {
          case "auth/wrong-password":
            setFieldError("password", "The password is incorrect.");
            break;
          case "auth/user-not-found":
            setFieldError("email", "Couldn't find your email.");
            break;
          case "auth/network-request-failed":
            setFieldError(
              "email",
              "Please check your network connection and try again."
            );
        }
        setSubmitting(false);
      });
  };
  return (
    <>
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
        {({
          handleChange,
          values,
          touched,
          isSubmitting,
          errors,
          handleSubmit,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="loginEmail">
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

            <Form.Group className="mb-3" controlId="loginPassword">
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

            <div className="d-grid gap-2">
              <Button
                variant="primary btn-block"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Spinner animation="border" /> : "Log In"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      <Button variant="btn btn-link" onClick={props.onClickHandler}>
        Don't have an account? Sign up here!
      </Button>
    </>
  );
};

export default Login;
