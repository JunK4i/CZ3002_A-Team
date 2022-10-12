import { React, useEffect } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import * as Yup from "yup";
import { Formik } from "formik";
import { auth } from "../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Typography.css";
import axios from "axios";

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
        if (!userCredential.user.emailVerified) {
          setFieldError("email", "Your email is not verified!");
          setSubmitting(false);
        } else {
          // Post data to backend
          axios
            .post("http://localhost:8000/newuser", {
              userid: `${userCredential.user.uid}`,
              name: `${values.name}`,
            })
            .then(
              (response) => {
                localStorage.setItem("uid", userCredential.user.uid);
                navigate("/dashboard");
                setSubmitting(false);
              },
              (error) => {
                setFieldError(
                  "email",
                  "Please check your connection and try again."
                );
                setSubmitting(false);
              }
            );
        }
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

  useEffect(() => {}, []);

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        key="login"
        initial={{ x: -100, opacity: 1 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
      >
        <div className="header1 mb-5">Login</div>
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

              <Form.Group className="mb-3" controlId="loginPassword">
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
                  {isSubmitting ? (
                    <Spinner animation="border" className="" />
                  ) : (
                    "Log In"
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
        <div className="d-flex align-item-center mt-2">
          <div
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: "#65706E",
              marginTop: "19px",
            }}
          />
          <Button
            variant="btn btn-link text-decoration-none pl-3 pr-3"
            onClick={props.onClickHandler}
            style={{ color: "#65706E", fontWeight: "bold" }}
          >
            Sign Up
          </Button>
          <div
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: "#65706E",
              marginTop: "19px",
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Login;
