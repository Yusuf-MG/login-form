/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable max-len */
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Col, Row, Container, Card, Button, Form, Overlay, Popover, OverlayTrigger,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './LoginStyle.css';
import { loginService } from '../../services/login/loginService';
import Input from '../SignUp/Input/Input';
import '../SignUp/Input/input.css';
import { AuthContext } from '../../services/login/AuthContext';

function LoginForm() {
  const [showToast, setToast] = useState(false);
  const [message, setMessage] = useState('');
  const {
    setAuth, setUserInfo, setRole, setCart, cart, setCartSize,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  const [input, setInput] = useState({
    email: '',
    password: '',
  });

  const inputs = [
    {
      id: 'email',
      name: 'email',
      type: 'email',
      err: '* Please enter a valid email\n> eg. john@mail.com',
      required: true,
      pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',
      label: 'Email',
    },
    {
      id: 'password',
      name: 'password',
      type: 'password',
      err: '',
      required: true,
      // eslint-disable-next-line quotes
      // pattern: '^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{9,20}$',
      label: 'Password',
    },
  ];

  const [valid, setValid] = useState({
    emailValid: false,
    passwordValid: false,
    formValid: false,
  });

  const validateForm = () => {
    setValid({
      formValid: valid.emailValid
        && valid.passwordValid,
    });
  };

  const validateInput = (inputName, value) => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    // const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{9,20}$/;

    let emailIsValid = valid.emailValid;
    let passwordIsValid = valid.passwordValid;

    switch (inputName) {
      case 'email':
        if (value.trim().length > 0 && emailRegex.test(value)) {
          emailIsValid = true;
        } else {
          emailIsValid = false;
        }
        break;
      case 'password':
        if (value.trim().length > 0) { // && passwordRegex.test(value)) {
          passwordIsValid = true;
        }
        break;
      default:
        break;
    }
    setValid({
      emailValid: emailIsValid,
      passwordValid: passwordIsValid,
    });
    validateForm();
  };

  const onInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    validateInput(e.target.name, e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = input;

    if (!email || email === '' || !password || password === '') {
      setMessage('Please fill out all fields');
      setToast(true);
    }

    try {
      const loginResult = await loginService.login({ email, password });

      if (loginResult) {
        const userInfo = loginService.getUserInfo();
        // Update AuthContext
        setAuth(true);
        setUserInfo(userInfo);
        setRole(userInfo.role);
        setCart(await cart.update());
        setCartSize(cart.size());

        switch (userInfo.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'driver':
            navigate('/driver');
            break;
          default:
            navigate('/productList');
        }
      } else {
        setMessage('Invalid login credentials, please try again.');
        setToast(true);
      }
    } catch (error) {
      setMessage('Not possible to logon now, please try again later.');
      setToast(true);
    }
  };

  return (
    <Container className="content-block">
      <Row className="vh-70 d-flex justify-content-center align-items-center">
        <Col md={110} lg={5} xs={12}>
          <Card className="shadow login-form-div">
            <Card.Body>
              <div className="mb-3 mt-md-4">
                <h3 className="signup-head mb-3 ">Account Login</h3>
                <div className="mb-3">
                  <Form onSubmit={handleSubmit}>

                    <Form.Group>
                      {inputs.map((formInput) => (
                        <Input
                          key={formInput.id}
                          {...formInput}
                          value={input[formInput.name]}
                          onChange={onInputChange}
                        />
                      ))}
                    </Form.Group>
                    <Container>
                      <Button type="submit" id="login-button" className="login-button mb-3 w-100">Login</Button>
                      <Overlay
                        show={showToast}
                        target={document.getElementById('login-button')}
                        placement="right"
                        container={this}
                        containerPadding={20}
                        trigger="focus"
                      >
                        <Popover id="popover-contained" title="Popover bottom">
                          <Container className="login-error-msg">
                            <FontAwesomeIcon icon="fa-solid fa-circle-exclamation" />
                            &nbsp;&nbsp;
                            {message}
                          </Container>
                        </Popover>
                      </Overlay>
                    </Container>
                  </Form>
                  <Form.Group
                    className="mb-3"
                    controlId="formBasicCheckbox"
                  >
                    <p className="small text-center">
                      Forgot your password?&nbsp;&nbsp;
                      <Link to="/forgot-password" className="signup-link">Click here</Link>
                    </p>
                  </Form.Group>
                  <div className="mt-3">
                    <p className="mb-0  text-center">
                      Do not have an account?&nbsp;
                      <Link to="/signup" className="signup-link">Sign Up</Link>
                    </p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginForm;
