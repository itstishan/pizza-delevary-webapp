import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";

import { useDispatch } from "react-redux";
import { cartActions } from "../store/shopping-cart/cartSlice";
import { API_URL } from "../config/api";

import "../styles/product-details.css";


const FoodDetails = () => {
  const [tab, setTab] = useState("desc");
  const [enteredName, setEnteredName] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  // starts null (not "") so we can tell "still loading" from "not found" before the fetch resolves
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [previewImg, setPreviewImg] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchFoodType = async () => {
      try {
        const res = await fetch(`${API_URL}/product/find/${id}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setProduct(data);
        setPreviewImg(data.img);
      } catch (error) {
        console.error(error);
        setNotFound(true);
      }
    }
    fetchFoodType();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/review/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  const addItem = () => {
    if (!product) return;
    dispatch(
      cartActions.addItem({
        id,
        title: product.title,
        price: product.price,
        img: product.img,
      })
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);

    try {
      const res = await fetch(`${API_URL}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          name: enteredName,
          email: enteredEmail,
          message: reviewMsg,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.msg || "Failed to submit review");
      }

      setEnteredName("");
      setEnteredEmail("");
      setReviewMsg("");
      await fetchReviews();
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (notFound) {
    return (
      <Helmet title="Product-details">
        <CommonSection title="Product not found" />
      </Helmet>
    );
  }

  if (!product) {
    return (
      <Helmet title="Product-details">
        <CommonSection title="Loading..." />
      </Helmet>
    );
  }

  // cover image plus gallery images, deduplicated in case an admin re-used the cover image in the gallery too
  const gallery = [product.img, ...(product.images || [])].filter(
    (img, index, all) => img && all.indexOf(img) === index
  );

  return (
    <Helmet title="Product-details">
      <CommonSection title={product.title} />

      <section>
        <Container>
          <Row>
            <Col lg="2" md="2">
              <div className="product__images ">
                {gallery.map((img) => (
                  <div
                    className={`img__item mb-3 ${previewImg === img ? "img__item-active" : ""}`}
                    onClick={() => setPreviewImg(img)}
                    key={img}
                  >
                    <img src={`${API_URL}/images/${img}`} alt={product.title} className="w-50" />
                  </div>
                ))}
              </div>
            </Col>

            <Col lg="4" md="4">
              <div className="product__main-img">
                <img src={`${API_URL}/images/${previewImg}`} alt={product.title} className="w-100" />
              </div>
            </Col>

            <Col lg="6" md="6">
              <div className="single__product-content">
                <h2 className="product__title mb-3">{product.title}</h2>
                <p className="product__price">
                  {" "}
                  Price: <span>${product.price}</span>
                </p>
                <p className="category mb-5">
                  Category: <span>{product.category}</span>
                </p>

                <button onClick={addItem} className="addTOCart__btn">
                  Add to Cart
                </button>
              </div>
            </Col>

            <Col lg="12">
              <div className="tabs d-flex align-items-center gap-5 py-3">
                <h6
                  className={` ${tab === "desc" ? "tab__active" : ""}`}
                  onClick={() => setTab("desc")}
                >
                  Description
                </h6>
                <h6
                  className={` ${tab === "rev" ? "tab__active" : ""}`}
                  onClick={() => setTab("rev")}
                >
                  Review ({reviews.length})
                </h6>
              </div>

              {tab === "desc" ? (
                <div className="tab__content">
                  <p>{product.description}</p>
                </div>
              ) : (
                <div className="tab__form mb-3">
                  {reviews.length === 0 ? (
                    <p className="pt-5">No reviews yet — be the first to write one.</p>
                  ) : (
                    reviews.map((review) => (
                      <div className="review pt-3" key={review._id}>
                        <p className="user__name mb-0">{review.name}</p>
                        <p className="user__email">{review.email}</p>
                        <p className="feedback__text">{review.message}</p>
                      </div>
                    ))
                  )}
                  <form className="form" onSubmit={submitHandler}>
                    <div className="form__group">
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={enteredName}
                        onChange={(e) => setEnteredName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form__group">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={enteredEmail}
                        onChange={(e) => setEnteredEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form__group">
                      <textarea
                        rows={5}
                        placeholder="Write your review"
                        value={reviewMsg}
                        onChange={(e) => setReviewMsg(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" className="addTOCart__btn" disabled={submittingReview}>
                      {submittingReview ? "Submitting..." : "Submit"}
                    </button>
                  </form>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default FoodDetails;
