import React from "react";
import "../../../styles/product-card.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../../../store/shopping-cart/cartSlice";
import { API_URL } from "../../../config/api";

const ProductCard = (props) => {
  const { _id, title, img, price } = props.item;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const isLogAdmin = user !== null && user !== undefined && user.isAdmin === true;

  const addToCart = () => {
    dispatch(
      cartActions.addItem({
        // cartSlice keys items by `id` - sending `_id` here used to leave every item's id undefined and merge all products into one
        id: _id,
        title,
        img,
        price,
      })
    );
  };

  const handleUpdate = () => {
    navigate(`/updatefoods/${_id}`)
  }

  const handleDelete = () => {
    if (!window.confirm("Delete this product?")) return;

    fetch(`${API_URL}/product/delete/${_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg === "Product deleted successfully") {
          alert("Product deleted successfully");
          navigate(`/home`);
        } else {
          console.error("Failed to delete product:", data.msg);
          alert("Failed to delete product: " + data.msg);
        }
      })
      .catch((error) => {
        console.error("Failed to delete product", error);
        alert("Failed to delete product");
      });
  };

  return (
    <div className="product__item">
      <div className="product__img">
        <img src={`${API_URL}/images/${img}`} alt={title} className="w-50" />
      </div>

      <div className="product__content">
        <h5>
          <Link to={`/foods/${_id}`}>{title}</Link>
        </h5>
        <div>
          {isLogAdmin ? (
            <div>
              <div className="d-flex align-items-center justify-content-between">
                <span className="product__price">${price}</span>
                <button className="addTOCart__btn" onClick={addToCart}>
                  Add to Cart
                </button>
              </div>
              <div className="up__delete">
              <div className="d-flex align-items-center justify-content-between">
                <button className="addTOCart__btn" onClick={handleUpdate}>
                  Edit
                </button>
                <button className="addTOCart__btn" onClick={handleDelete}>
                  Delete
                </button>
              </div>
              </div>

            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-between">
              <span className="product__price">${price}</span>
              <button className="addTOCart__btn" onClick={addToCart}>
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
