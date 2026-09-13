import React, { useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { API_URL } from '../config/api'

import '../styles/add-foods.css'
import { Container } from "reactstrap";

// kept in sync with the categories Home.jsx filters by, so a typo (e.g. "Pizzas") can't make a product vanish from the home page
const CATEGORY_OPTIONS = ["Burger", "Pizza", "Bread"];
const MAX_GALLERY_IMAGES = 5;

const AddFoods = () => {
    const [title, setTitle] = useState("")
    const [description, setDesc] = useState("")
    const [image, setImage] = useState("")
    const [galleryImages, setGalleryImages] = useState([])
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState(CATEGORY_OPTIONS[0])
    const [submitting, setSubmitting] = useState(false)
    const navigate = useNavigate()

    const {token} = useSelector((state) => state.auth);


    // type="file", e.target.files[0]
    const onChangeFile = (e) => {
      setImage(e.target.files[0])
    }

    const handleCloseImg = () => {
      setImage('')
    }

    const onChangeGalleryFiles = (e) => {
      const files = Array.from(e.target.files || []).slice(0, MAX_GALLERY_IMAGES);
      setGalleryImages(files);
    }

    const removeGalleryImage = (index) => {
      setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    }

    const handleCreateProduct = async (e) => {
      e.preventDefault();

      if (!image) {
          alert("Please choose an image for the product");
          return;
      }

      setSubmitting(true);

      try {
          const formData = new FormData();
          formData.append("image", image);

          const uploadRes = await fetch(`${API_URL}/upload/image`, {
              headers: {
                  "Authorization": `Bearer ${token}`
              },
              method: "POST",
              body: formData
          });

          const uploadData = await uploadRes.json();

          if (!uploadRes.ok) {
              throw new Error(uploadData.msg || "Failed to upload image");
          }

          // the server decides the actual stored filename now, so use what it returns instead of guessing one client-side
          const filename = uploadData.filename;

          // optional extra gallery images shown on the product details page
          let galleryFilenames = [];
          if (galleryImages.length > 0) {
              const galleryFormData = new FormData();
              galleryImages.forEach((file) => galleryFormData.append("images", file));

              const galleryRes = await fetch(`${API_URL}/upload/images`, {
                  headers: {
                      "Authorization": `Bearer ${token}`
                  },
                  method: "POST",
                  body: galleryFormData
              });

              const galleryData = await galleryRes.json();

              if (!galleryRes.ok) {
                  throw new Error(galleryData.msg || "Failed to upload gallery images");
              }

              galleryFilenames = galleryData.filenames;
          }

          // uploading product
          const res = await fetch(`${API_URL}/product/`, {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              method: 'POST',
              body: JSON.stringify({
                  title,
                  description,
                  img: filename,
                  images: galleryFilenames,
                  price,
                  category
              })
          });

          if (res.ok) {
              alert("Food Added!");
              navigate(`/foods`);
          } else {
              const errorResponse = await res.json();
              throw new Error(errorResponse.msg || "Failed to create product");
          }
      } catch (error) {
          console.error(error.message);
          alert("Error: " + error.message);
      } finally {
          setSubmitting(false);
      }
  }


    return(
        <Helmet title="addfoods">
            <CommonSection title="Add Foods" />

            <section>
                <Container>
                    <div className="container__all">
                        <div className="wrapper">
                            <form onSubmit={handleCreateProduct} encType="multipart/form-data">
                                <div className="inputWrapper">
                                    <label>Title: </label>
                                    <input type="text"
                                    placeholder='Title...'
                                    className="input"
                                    required
                                    onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="inputWrapper">
                                    <label>Description: </label>
                                    <input type="text"
                                    placeholder='Description...'
                                    className="input"
                                    required
                                    onChange={(e) => setDesc(e.target.value)}
                                    />
                                </div>
                                <div className="inputWrapperImage">
                                    <label htmlFor="image" className="labelFileInput">Cover Image: <span>Upload here</span></label>
                                    <input type="file"
                                    id="image"
                                    placeholder='Image...'
                                    className="input"
                                    accept="image/*"
                                    onChange={onChangeFile}
                                    style={{ display: 'none' }}
                                    />
                                    {image && <p className="imageName">{image.name} <AiOutlineCloseCircle onClick={handleCloseImg} className="closeIcon" /></p>}
                                </div>
                                <div className="inputWrapperImage">
                                    <label htmlFor="galleryImages" className="labelFileInput">Gallery Images: <span>Upload here (optional, up to {MAX_GALLERY_IMAGES})</span></label>
                                    <input type="file"
                                    id="galleryImages"
                                    className="input"
                                    accept="image/*"
                                    multiple
                                    onChange={onChangeGalleryFiles}
                                    style={{ display: 'none' }}
                                    />
                                    {galleryImages.map((file, index) => (
                                        <p className="imageName" key={`${file.name}-${index}`}>
                                            {file.name} <AiOutlineCloseCircle onClick={() => removeGalleryImage(index)} className="closeIcon" />
                                        </p>
                                    ))}
                                </div>
                                <div className="inputWrapper">
                                    <label>Price: </label>
                                    <input type="number"
                                    step={0.01}
                                    min={0}
                                    placeholder='Price...'
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
                                    {submitting ? "Submitting..." : "Submit"}
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

export default AddFoods
