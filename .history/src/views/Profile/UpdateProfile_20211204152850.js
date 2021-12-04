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
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            {/* <Form.Group id="email" className="mb-3">
                <Form.Control
                  type="email"
                  ref={emailRef}
                  defaultValue={currentUser.email}
                  required
                />
              </Form.Group> */}
            <Form.Group id="email" className="mb-3">
              <Form.Control
                type="email"
                className="form-control"
                required
                ref={emailRef}
                defaultValue={currentUser.email}
                placeholder="Team account name"
              />
            </Form.Group>
            {/* <Form.Group id="password" className="mb-3">
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
              </Form.Group> */}
            <Button disabled={loading} className="w-100" type="submit">
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link to="/">Cancel</Link>
      </div>
    </>
  );
}
