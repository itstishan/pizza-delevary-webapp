import React, { useEffect, useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container } from "reactstrap";
import { API_URL } from '../config/api';
import '../styles/add-foods.css';

const CATEGORY_OPTIONS = ["Burger", "Pizza", "Bread"];

const UpdateFoods = () => {
    const [title, setTitle] = useState("");
    const [description, setDesc] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loadError, setLoadError] = useState("");
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/product/find/${id}`);
                if (response.ok) {
                    const product = await response.json();
                    setData(product);
                    setTitle(product.title);
                    setDesc(product.description);
                    setPrice(product.price);
                    setCategory(product.category);
                } else {
                    setLoadError("Error fetching product data");
                }
            } catch (error) {
                console.error(error);
                setLoadError("Error fetching product data");
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch(`${API_URL}/product/update/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    price,
                    category
                })
            })

            if (res.ok) {
                alert("Food updated!");
                navigate(`/foods`)
            } else {
                const errorResponse = await res.json();
                throw new Error(errorResponse.msg || "Failed to update product");
            }
        } catch (error) {
            console.error(error.message);
            alert("Error: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loadError) {
        return <div className="text-center py-5">{loadError}</div>;
    }

    if (!data) {
        return <div className="text-center py-5">Loading...</div>;
    }
    return(
        <Helmet title="addfoods">
            <CommonSection title="Update Foods" />

            <section>
                <Container>
                    <img src={`${API_URL}/images/${data.img}`} alt={data.title} className="w-50" />
                    <div className="container__all">
                        <div className="wrapper">
                            <form onSubmit={handleUpdateProduct}>
                                <div className="inputWrapper">
                                    <label>Title: </label>
                                    <input type="text"
                                    placeholder='Title...'
                                    value={title}
                                    className="input"
                                    required
                                    onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="inputWrapper">
                                    <label>Description: </label>
                                    <input type="text"
                                    placeholder='Description...'
                                    value={description}
                                    className="input"
                                    required
                                    onChange={(e) => setDesc(e.target.value)}
                                    />
                                </div>
                                <div className="inputWrapper">
                                    <label>Price: </label>
                                    <input type="number"
                                    step={0.01}
                                    min={0}
                                    placeholder='Price...'
                                    value={price}
                                    className="input"
                                    required
                                    onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                                <div className="inputWrapper">
                                    <label>Category: </label>
                                    <select
                                    className="input"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    >
                                        {CATEGORY_OPTIONS.map((option) => (
                                            <option value={option} key={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="buttonWrapper">
                                    <button type="submit" className="submitBtn" disabled={submitting}>
                                    {submitting ? "Saving..." : "Submit"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Container>
            </section>
        </Helmet>
    )
}

export default UpdateFoods
