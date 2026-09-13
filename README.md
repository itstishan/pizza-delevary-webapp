<div align="center">

# 🍕 Pizza Delivery Web App

A full-stack food ordering platform built on the MERN stack - browse by category, search & sort, manage a cart, check out, and administer the menu.

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-17-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
  - [Creating an Admin User](#creating-an-admin-user)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Security Notes](#security-notes)
- [License](#license)

---

## Overview

This app lets customers browse a food menu (Burger / Pizza / Bread), search and sort items, add them to a persistent cart, and place an order through checkout. Admins get a separate, protected flow to add, edit, and delete menu items with image uploads.

The backend is a REST API (Express + MongoDB/Mongoose) with JWT-based authentication and role-based access control; the frontend is a React SPA using Redux Toolkit for state and Redux Persist to survive page reloads.

## Features

**Customer**
- Browse products by category, with live search and sorting (price, alphabetical)
- Paginated product listing
- Product details page with an image gallery and customer reviews
- Persistent shopping cart (add / increment / decrement / remove) that survives a page refresh
- Guest checkout — shipping details + order placed against the backend
- Account registration and login (JWT)
- Contact form backed by a real API endpoint

**Admin**
- Role-gated `Add Food` / `Update Food` pages (both server- and client-enforced)
- Product image upload, including an optional gallery of extra images per product
- Create, update, and delete menu items

## Tech Stack

| Layer | Technologies |
|---|---|
| **Client** | React 17, React Router 6, Redux Toolkit, Redux Persist, Reactstrap / Bootstrap 5, react-slick, react-paginate, Remix Icon |
| **Server** | Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Multer |

## Project Structure

```
Pizza_Delevary_WebApp/
├── backend/
│   ├── controllers/       # auth, product, order, upload, contact, review route handlers
│   ├── middllewares/       # JWT verification (user / admin)
│   ├── models/             # Mongoose schemas — User, Product, Order, ContactMessage, Review
│   ├── public/images/      # uploaded product images
│   ├── tests/              # Jest + Supertest unit tests (mocked models)
│   └── index.js            # app entry point
└── client/
    └── src/
        ├── components/     # Header, Footer, Layout, cart UI, product card, sliders...
        ├── pages/          # Home, AllFoods, FoodDetails, Cart, Checkout, Login, Register, Add/UpdateFood, Contact
        ├── routes/         # route definitions + admin route guard
        ├── store/          # Redux slices — auth, cart, cartUi
        └── config/         # API base URL config
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or later
- A MongoDB database — either a local instance or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### Installation

```bash
git clone https://github.com/Tishan-001/Pizza_Delevary_WebApp.git
cd Pizza_Delevary_WebApp

cd backend && npm install
cd ../client && npm install
```

### Environment Variables

Create `backend/.env`:

| Variable | Description | Example |
|---|---|---|
| `MONGODB_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/pizza-app` |
| `PORT` | Port the API listens on | `5000` |
| `JWT_SECRET` | Long random string used to sign auth tokens | `a4f8e1...` |

`backend/.env` is git-ignored — never commit real credentials.

Optionally create `client/.env` to point the frontend at a different API host (defaults to `http://localhost:5000`):

| Variable | Description | Example |
|---|---|---|
| `REACT_APP_API_URL` | Base URL of the backend API | `http://localhost:5000` |

### Running the App

```bash
# terminal 1 — API
cd backend
npm run dev        # nodemon, restarts on change
# or: npm start

# terminal 2 — client
cd client
npm start
```

| Service | URL |
|---|---|
| Client | http://localhost:3000 |
| API | http://localhost:5000 |

### Creating an Admin User

Registration always creates a regular user (`isAdmin: false`) by design — no one can grant themselves admin from the signup form. To manage the menu, register normally, then flip the flag directly in the database:

```js
// mongosh / MongoDB Compass, against your database
db.users.updateOne({ email: "you@example.com" }, { $set: { isAdmin: true } })
```

Log out and back in afterwards so a fresh token (carrying `isAdmin: true`) is issued.

## Available Scripts

**Backend** (`backend/`)

| Command | Description |
|---|---|
| `npm run dev` | Start the API with nodemon (auto-restart) |
| `npm start` | Start the API with node |
| `npm test` | Run the Jest test suite |

**Client** (`client/`)

| Command | Description |
|---|---|
| `npm start` | Start the React dev server |
| `npm run build` | Production build |
| `npm test` | Run the Jest + React Testing Library test suite |

## API Reference

All authenticated requests send `Authorization: Bearer <token>`.

<details>
<summary><strong>Auth</strong></summary>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Create a user account |
| POST | `/auth/login` | — | Log in, returns user + JWT |

</details>

<details>
<summary><strong>Products</strong></summary>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/product` | — | List products (optional `?category=`) |
| GET | `/product/find/:id` | — | Get a single product |
| POST | `/product` | Admin | Create a product |
| PUT | `/product/update/:id` | Admin | Update a product |
| DELETE | `/product/delete/:id` | Admin | Delete a product |

</details>

<details>
<summary><strong>Upload</strong></summary>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/upload/image` | Admin | Upload a single product cover image |
| POST | `/upload/images` | Admin | Upload up to 5 gallery images (field name `images`) |

</details>

<details>
<summary><strong>Orders</strong></summary>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/order` | — | Place an order (checkout) |
| GET | `/order/:id` | — | Get an order by id |

</details>

<details>
<summary><strong>Contact</strong></summary>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/contact` | — | Submit a contact message |

</details>

<details>
<summary><strong>Reviews</strong></summary>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/review/:productId` | — | List reviews for a product |
| POST | `/review` | — | Submit a review for a product |

</details>

## Testing

**Backend** — Jest + Supertest, with Mongoose models mocked (`jest.mock('../models/...')`), so the suite runs without a real database connection:

```bash
cd backend
npm test
```

Coverage includes the JWT middleware (missing/malformed/invalid tokens, admin-only checks), auth (registration rejects a client-supplied `isAdmin` flag, login signs `isAdmin` into the token, wrong credentials return 401), product filtering (only `category` is ever forwarded to the query), and order total calculation.

**Client** — Jest + React Testing Library (already bundled by Create React App):

```bash
cd client
npm test
```

Coverage includes the cart reducer (add/remove/delete/clear), the product-card → cart wiring (regression test for a bug where two different products could merge into one cart line), the empty-cart display, and the admin route guard.

## Security Notes

- Rotate `MONGODB_URL` and `JWT_SECRET` if this repository was ever pushed with a populated `.env` in its history.
- Admin privileges can only be granted via direct database access — never via a client-supplied field.

## License

No license has been specified for this project yet. All rights reserved by the author unless a license is added.
