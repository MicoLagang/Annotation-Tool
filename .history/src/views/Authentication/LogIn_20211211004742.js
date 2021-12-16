// import React, { useRef, useState } from 'react'
// import { Form, Button, Card, Alert } from "react-bootstrap"
// import { useAuth } from '../../logic/context/AuthContext'
// import { Link, useHistory } from "react-router-dom"

// export default function LogIn() {
//     const emailRef = useRef()
//     const passwordRef = useRef()
//     const { login, currentUser }  = useAuth()
//     const [error, setError] = useState('')
//     const [loading, setLoading] = useState(false)
//     const history = useHistory()

//     async function handleSubmit(e) {
//         e.preventDefault()

//         try {
//             setError('')
//             setLoading(true)
//             await login(emailRef.current.value, passwordRef.current.value)
//             history.push("/")
//         } catch (error) {
//             setError(error.message)
//         }

//         setLoading(false)
//     }

//     return (
//         <>
//             <Card>
//                 <Card.Body>
//                     <h2 className="text-center mb-4">Log In</h2>
//                     {error && <Alert variant="danger">{error}</Alert>}
//                     <Form onSubmit={handleSubmit}>
//                         <Form.Group id="email" className="mb-3">
//                             <Form.Control placeholder="Email" type="email" ref={emailRef} required />
//                         </Form.Group>
//                         <Form.Group id="password" className="mb-3">
//                             <Form.Control placeholder="Password" type="password" ref={passwordRef} required />
//                         </Form.Group>
//                         <Button disabled={loading} className="w-100" type="submit">Log In</Button>
//                     </Form>
//                     <div className="w-100 text-center mt-3">
//                         <Link to="/forgot-password">Forgot Password?</Link>
//                     </div>
//                 </Card.Body>
//             </Card>
//             <div className="w-100 text-center mt-2">
//                 Need an account? <Link to="/signup">Sign Up</Link>
//             </div>
//         </>
//     )
// }

// import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../../logic/context/AuthContext";
import { Link, useHistory } from "react-router-dom";

// export default function LogIn() {
// const emailRef = useRef()
// const passwordRef = useRef()
// const { login, currentUser }  = useAuth()
// const [error, setError] = useState('')
// const [loading, setLoading] = useState(false)
// const history = useHistory()

// async function handleSubmit(e) {
//     e.preventDefault()

//     try {
//         setError('')
//         setLoading(true)
//         await login(emailRef.current.value, passwordRef.current.value)
//         history.push("/")
//     } catch (error) {
//         setError(error.message)
//     }

//     setLoading(false)
// }

//     return (
//         <>
//             <Card>
//                 <Card.Body>
//                     <h2 className="text-center mb-4">Log In</h2>
//                     {error && <Alert variant="danger">{error}</Alert>}
//                     <Form onSubmit={handleSubmit}>
//                         <Form.Group id="email" className="mb-3">
//                             <Form.Control placeholder="Email" type="email" ref={emailRef} required />
//                         </Form.Group>
//                         <Form.Group id="password" className="mb-3">
//                             <Form.Control placeholder="Password" type="password" ref={passwordRef} required />
//                         </Form.Group>
//                         <Button disabled={loading} className="w-100" type="submit">Log In</Button>
//                     </Form>
//                     <div className="w-100 text-center mt-3">
//                         <Link to="/forgot-password">Forgot Password?</Link>
//                     </div>
//                 </Card.Body>
//             </Card>
//             <div className="w-100 text-center mt-2">
//                 Need an account? <Link to="/signup">Sign Up</Link>
//             </div>
//         </>
//     )
// }

import React, { useRef, useState } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Fade,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// logo
import logo from "./logo.svg";
// import google from "../../images/google.svg";

// context
import { useUserDispatch, loginUser } from "../../context/UserContext";

import userServices from "../../services/user.services";

function Login(props) {
  var classes = useStyles();

  // global
  var userDispatch = useUserDispatch();

  // local
  var [isLoading, setIsLoading] = useState(false);
  //   var [error, setError] = useState(null);
  var [activeTabId, setActiveTabId] = useState(0);
  var [nameValue, setNameValue] = useState("");
  var [loginValue, setLoginValue] = useState("");
  var [passwordValue, setPasswordValue] = useState("");

  var [loginValue1, setLoginValue1] = useState("");
  var [userName, setuserName] = useState("");
  var [passwordValue1, setPasswordValue1] = useState("");
  var [passwordValueS, setPasswordValueS] = useState("");

  var [role, setRole] = useState("");
  //   test
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  // test2

  const passwordConfirmRef = useRef();
  const { signup, currentUser1 } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(loginValue, passwordValue);
      history.push("/");
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  }

  async function handleSubmitSignUp(e) {
    e.preventDefault();

    if (passwordValue1 !== passwordValueS) {
      return setError("Passwords do not match");
    }else if(passwordValue1.length <6){
      return setError("Password is too short");
    }
    

    try {
      setError("");
      setLoading(true);
      await signup(loginValue1, passwordValue1);

      const data = {
        email: loginValue1,
        username: userName,
      };


      userServices
      .create(data)
      history.push("/");
    } catch (error) {
      setError(error.message);
    }





    setLoading(false);
  }

  function forgotPassword() {
    history.push("/forgot-password");
  }

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        {/* <img src={logo} alt="logo" className={classes.logotypeImage} /> */}
        <Typography className={classes.logotypeText}>iLABEL</Typography>
        <h5>A Digital Annotation Tool for Machine Vision Task</h5>
      </div>
      <div className={classes.formContainer}>
        <div className={classes.form}>
          <Tabs
            value={activeTabId}
            onChange={(e, id) => setActiveTabId(id)}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Login" classes={{ root: classes.tab }} />
            <Tab label="New User" classes={{ root: classes.tab }} />
          </Tabs>
          {activeTabId === 0 && (
            <React.Fragment>
              <Typography variant="h1" className={classes.greeting}>
                Hello, User
              </Typography>

              {/* <Button size="large" className={classes.googleButton}>
                <img src={google} alt="google" className={classes.googleIcon} />
                &nbsp;Sign in with Google
              </Button> */}

              {/* <div className={classes.formDividerContainer}>
                <div className={classes.formDivider} />
                <Typography className={classes.formDividerWord}>or</Typography>
                <div className={classes.formDivider} />
              </div> */}
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  {/* Something is wrong with your login or password :( */}
                    {error}
                </Typography>
              </Fade>
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
                margin="normal"
                placeholder="Email Address"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              />
              <div className={classes.formButtons}>
                {isLoading ? (
                  <CircularProgress size={26} className={classes.loginLoader} />
                ) : (
                  <Button
                    disabled={
                      loginValue.length === 0 || passwordValue.length === 0
                    }
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                  >
                    Login
                  </Button>
                )}
                <Button
                  color="primary"
                  size="large"
                  className={classes.forgetButton}
                  onClick={forgotPassword}
                >
                  Forget Password
                </Button>
              </div>
            </React.Fragment>
          )}
    
          {activeTabId === 1 && (
            
            <React.Fragment>
              <Typography variant="h1" className={classes.greeting}>
                Welcome!
              </Typography>
              <Typography variant="h2" className={classes.subGreeting}>
                Create your account
              </Typography>
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  {error}
                </Typography>
              </Fade>
            

              <TextField
                id="username"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={userName}
                onChange={(e) => setuserName(e.target.value)}
                margin="normal"
                placeholder="Name"
                type="text"
                fullWidth
              />

              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={loginValue1}
                onChange={(e) => setLoginValue1(e.target.value)}
                margin="normal"
                placeholder="Email Address"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue1}
                onChange={(e) => setPasswordValue1(e.target.value)}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValueS}
                onChange={(e) => setPasswordValueS(e.target.value)}
                margin="normal"
                placeholder="Confirm Password"
                type="password"
                fullWidth
              />

              <div className={classes.creatingButtonContainer}>
                {isLoading ? (
                  <CircularProgress size={26} />
                ) : (
                  <Button
                    onClick={handleSubmitSignUp}
                    disabled={
                      loginValue1.length === 0 ||
                      passwordValue1.length === 0 ||
                      passwordValueS.length === 0
                    }
                    size="large"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={classes.createAccountButton}
                  >
                    Create your account
                  </Button>
                )}
              </div>
              {/* <div className={classes.formDividerContainer}>
                <div className={classes.formDivider} />
                <Typography className={classes.formDividerWord}>or</Typography>
                <div className={classes.formDivider} />
              </div> */}
              {/* <Button
                size="large"
                className={classnames(
                  classes.googleButton,
                  classes.googleButtonCreating,
                )}
              >
                <img src={google} alt="google" className={classes.googleIcon} />
                &nbsp;Sign in with Google
              </Button> */}
            </React.Fragment>
          )}
        </div>
        <Typography color="primary" className={classes.copyright}>
          {/* © 2014-{new Date().getFullYear()} <a style={{ textDecoration: 'none', color: 'inherit' }} href="https://flatlogic.com" rel="noopener noreferrer" target="_blank">Flatlogic</a>, LLC. All rights reserved. */}
        </Typography>
      </div>
    </Grid>
  );
}

export default withRouter(Login);
