import React, { useRef, useState } from "react";
import { Form, Container, Alert } from "react-bootstrap";
import { useAuth } from "../../logic/context/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import TopNav from "../Navigation/TopNav";

export default function UpdateProfile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { currentUser, updatePassword, updateEmail } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    const promises = [];
    setLoading(true);
    setError("");

    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value));
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        history.push("/");
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <TopNav></TopNav>

      <Container
        className="mt-5 d-flex justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="submit-form w-100" style={{ maxWidth: "350px" }}>
          <h2 className="text-center mb-4">Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group id="email" className="mb-3">
              <Form.Control
                type="email"
                className="form-control"
                required
                disabled
                ref={emailRef}
                defaultValue={currentUser.email}
                placeholder="Team account name"
              />
            </Form.Group>

            <Form.Group id="password" className="mb-3">
              <Form.Control
                placeholder="Leave blank to keep the same password"
                type="password"
                ref={passwordRef}
              />
            </Form.Group>

            <Form.Group id="password-confirm" className="mb-4">
              <Form.Control
                placeholder="Leave blank to keep the same password"
                type="password"
                ref={passwordConfirmRef}
              />
            </Form.Group>

            <Button
              disabled={loading}
              className="w-100 mb-2"
              type="submit"
              variant="outline"
              color="primary"
            >
              Update
            </Button>
            <Button className="w-100 text-capitalize" type="button" href="/">
              Cancel
            </Button>
          </Form>
        </div>
      </Container>
    </>
  );
}
