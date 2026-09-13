import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { API_URL } from "../config/api";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text }

  const submitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Failed to send message");
      }

      setStatus({ type: "success", text: "Thanks! Your message has been sent." });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      setStatus({ type: "error", text: error.message || "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Helmet title="Contact">
      <CommonSection title="Contact Us" />
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="12">
              <h5 className="mb-4">Get in touch</h5>
              <p className="mb-3">
                Location: 14 Ward Place, Colombo 07, Sri Lanka
              </p>
              <p className="mb-3">Phone: +94 76 123 4567</p>
              <p className="mb-3">Email: example@gmail.com</p>
              <p className="mb-0">
                Sunday - Thursday: 10:00am - 11:00pm <br />
                Friday - Saturday: Off day
              </p>
            </Col>

            <Col lg="6" md="6" sm="12">
              <form className="form" onSubmit={submitHandler}>
                {status && (
                  <p className={status.type === "success" ? "text-success" : "text-danger"}>
                    {status.text}
                  </p>
                )}
                <div className="form__group">
                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form__group">
                  <input
                    type="email"
                    placeholder="Your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form__group">
                  <input
                    type="text"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="form__group">
                  <textarea
                    rows={5}
                    placeholder="Your message"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <button type="submit" className="addTOCart__btn" disabled={submitting}>
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Contact;
