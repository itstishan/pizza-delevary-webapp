import React, { useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { authAction } from '../store/author/authSlice'
import { useDispatch } from 'react-redux'
import { API_URL } from '../config/api'

const Register = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSignup = async(e) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        headers: {
          "Content-Type": 'application/json'
        },
        method: "POST",
        body: JSON.stringify({username, email, password})
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.msg || "Registration failed")
      }

      dispatch(authAction.register(data))
      navigate('/')

    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Helmet title="Signup">
      <CommonSection title="Signup" />
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="12" className="m-auto text-center">
              <form className="form mb-5" onSubmit={handleSignup}>
                {error && <p className="text-danger">{error}</p>}
              <div className="form__group">
                  <input
                    type="text"
                    placeholder="User name"
                    required
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
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
                    minLength={6}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="addTOCart__btn" disabled={submitting}>
                  {submitting ? "Signing up..." : "Sign Up"}
                </button>
              </form>
              <Link to="/login">Already have an account? Login</Link>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Register;
