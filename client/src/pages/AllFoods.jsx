import React, { useState, useEffect } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";

import { Container, Row, Col } from "reactstrap";

import ProductCard from "../components/UI/product-card/ProductCard";
import ReactPaginate from "react-paginate";
import { API_URL } from "../config/api";

import "../styles/all-foods.css";
import "../styles/pagination.css";

const AllFoods = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  const [pageNumber, setPageNumber] = useState(0);

  const [filteredFoods, setFilteredFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFoodType = async () => {
      try {
        const res = await fetch(`${API_URL}/product/`);
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        setFilteredFoods(data);
      } catch (err) {
        console.error(err);
        setError("Could not load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchFoodType();
  },[]);

  // reset to page 0 on search/sort change, or page 2+ could land past the end of the filtered results and render empty
  useEffect(() => {
    setPageNumber(0);
  }, [searchTerm, sortOrder]);

  const searchedProduct = filteredFoods.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...searchedProduct].sort((a, b) => {
    switch (sortOrder) {
      case "ascending":
        return a.title.localeCompare(b.title);
      case "descending":
        return b.title.localeCompare(a.title);
      case "high-price":
        return Number(b.price) - Number(a.price);
      case "low-price":
        return Number(a.price) - Number(b.price);
      default:
        return 0;
    }
  });


  const productPerPage = 12;
  const visitedPage = pageNumber * productPerPage;
  const displayPage = sortedProducts.slice(
    visitedPage,
    visitedPage + productPerPage
  );

  const pageCount = Math.ceil(sortedProducts.length / productPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <Helmet title="All-Foods">
      <CommonSection title="All Foods" />

      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="6" xs="12">
              <div className="search__widget d-flex align-items-center justify-content-between ">
                <input
                  type="text"
                  placeholder="I'm looking for...."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span>
                  <i className="ri-search-line"></i>
                </span>
              </div>
            </Col>
            <Col lg="6" md="6" sm="6" xs="12" className="mb-5">
              <div className="sorting__widget text-end">
                <select
                  className="w-50"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="ascending">Alphabetically, A-Z</option>
                  <option value="descending">Alphabetically, Z-A</option>
                  <option value="high-price">High Price</option>
                  <option value="low-price">Low Price</option>
                </select>
              </div>
            </Col>

            {loading && (
              <Col lg="12" className="text-center py-5">
                <p>Loading foods...</p>
              </Col>
            )}

            {!loading && error && (
              <Col lg="12" className="text-center py-5">
                <p className="text-danger">{error}</p>
              </Col>
            )}

            {!loading && !error && displayPage.length === 0 && (
              <Col lg="12" className="text-center py-5">
                <p>No foods found.</p>
              </Col>
            )}

            {!loading && !error && displayPage.map((item) => (
              <Col lg="3" md="4" sm="6" xs="6" key={item._id} className="mb-4">
                <ProductCard item={item} />
              </Col>
            ))}

            {!loading && !error && pageCount > 1 && (
              <div>
                <ReactPaginate
                  pageCount={pageCount}
                  forcePage={pageNumber}
                  onPageChange={changePage}
                  previousLabel={"Prev"}
                  nextLabel={"Next"}
                  containerClassName=" paginationBttns "
                />
              </div>
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default AllFoods;
