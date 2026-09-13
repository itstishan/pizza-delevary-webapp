import React, { useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import {useDispatch} from 'react-redux'
import { Link, useNavigate } from "react-router-dom";
import { authAction } from '../store/author/authSlice'
import { API_URL } from '../config/api'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async(e) => {
      e.preventDefault()
      setError("")
      setSubmitting(true)

      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          headers: {
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify({email, password})
        })

        const data = await res.json()

        // fetch doesn't throw on 4xx/5xx - without this check a wrong password used to log in as an error string and navigate away
        if (!res.ok) {
          throw new Error(data.msg || "Login failed")
        }

        dispatch(authAction.login(data)) // {others, token}
        navigate("/")

      } catch (error){
        setError(error.message || "Something went wrong. Please try again.")
      } finally {
        setSubmitting(false)
      }
  }
  return (
    <Helmet title="Login">
      <CommonSection title="Login" />
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="12" className="m-auto text-center">
              <form className="form mb-5" onSubmit={handleLogin}>
                {error && <p className="text-danger">{error}</p>}
                <div className="form__group">
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form__group">
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="addTOCart__btn" disabled={submitting}>
                  {submitting ? "Logging in..." : "Login"}
                </button>
              </form>
              <Link to="/register">
                Don't have an account? Create an account
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Login;
