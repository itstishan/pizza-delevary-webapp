import React, { useRef, useEffect } from "react";
import { Container } from "reactstrap";
import logo from "../../assets/images/logo.png";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { cartUiActions } from "../../store/shopping-cart/cartUiSlice";
import { authAction } from "../../store/author/authSlice";
import "../../styles/header.css";

const navLinks1 = [
  {
    display: "Home",
    path: "/home",
  },
  {
    display: "Foods",
    path: "/foods",
  },
  {
    display: "Cart",
    path: "/cart",
  },
  {
    display: "Contact",
    path: "/contact",
  },
];

const navLinks2 = [
  {
    display: "Home",
    path: "/home",
  },
  {
    display: "Foods",
    path: "/foods",
  },
  {
    display: "Add Item",
    path: "/addfoods",
  },
];

const Header = () => {
  const menuRef = useRef(null);
  const headerRef = useRef(null);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLogged = user !== null && user !== undefined;
  const isLogAdim = isLogged && user.isAdmin === true;

  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");

  const toggleCart = () => {
    dispatch(cartUiActions.toggle());
  };

  const handleLogout = () => {
    dispatch(authAction.logout());
    navigate('/home'); // Redirect to home page after logout
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 80 || document.documentElement.scrollTop > 80;
      headerRef.current.classList.toggle("header__shrink", isScrolled);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <div className="nav__wrapper d-flex align-items-center justify-content-between">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>

          {/* ======= menu ======= */}
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            {isLogAdim? (
              <div className="menu d-flex align-items-center gap-5">
              {navLinks2.map((item, index) => (
                <NavLink
                  to={item.path}
                  key={index}
                  className={(navClass) =>
                    navClass.isActive ? "active__menu" : ""
                  }
                >
                  {item.display}
                </NavLink>
              ))}
            </div>
            ):(
              <div className="menu d-flex align-items-center gap-5">
              {navLinks1.map((item, index) => (
                <NavLink
                  to={item.path}
                  key={index}
                  className={(navClass) =>
                    navClass.isActive ? "active__menu" : ""
                  }
                >
                  {item.display}
                </NavLink>
              ))}
            </div>
            )}
          </div>

          {/* ======== nav right icons ========= */}
          <div className="nav__right d-flex align-items-center gap-4">
            <span className="cart__icon" onClick={toggleCart}>
              <i className="ri-shopping-basket-line"></i>
              <span className="cart__badge">{totalQuantity}</span>
            </span>

            {isLogged? (
              <div>
                <button onClick={handleLogout} className="logout">Log out</button>
                
              </div>
            ):(
              <div>
                <span className="user">
                  <Link to="/login">
                    <button className="logout">Login</button>
                  </Link>
                  <Link to="/register">
                    <button className="logout">Register</button>
                  </Link>
                </span>
              </div>
            )}

            <span className="mobile__menu" onClick={toggleMenu}>
              <i className="ri-menu-line"></i>
            </span>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
