import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

import cartReducer from '../../../store/shopping-cart/cartSlice';
import authReducer from '../../../store/author/authSlice';
import ProductCard from './ProductCard';

const buildStore = () =>
  configureStore({ reducer: { cart: cartReducer, auth: authReducer } });

const renderCard = (item, store) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ProductCard item={item} />
      </MemoryRouter>
    </Provider>
  );

describe('ProductCard add-to-cart', () => {
  it('dispatches the product\'s _id as the cart item\'s id (regression: this used to send `_id` as a literal key, leaving cartSlice\'s `id` field undefined)', () => {
    const store = buildStore();
    renderCard({ _id: 'abc123', title: 'Cheese Pizza', img: 'pizza.jpg', price: 12 }, store);

    fireEvent.click(screen.getByText(/add to cart/i));

    const { cartItems } = store.getState().cart;
    expect(cartItems).toHaveLength(1);
    expect(cartItems[0].id).toBe('abc123');
  });

  it('adding two different products keeps them as two separate cart lines', () => {
    const store = buildStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductCard item={{ _id: 'a', title: 'Pizza', img: 'a.jpg', price: 10 }} />
          <ProductCard item={{ _id: 'b', title: 'Burger', img: 'b.jpg', price: 5 }} />
        </MemoryRouter>
      </Provider>
    );

    const buttons = screen.getAllByText(/add to cart/i);
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);

    const { cartItems } = store.getState().cart;
    expect(cartItems).toHaveLength(2);
    expect(cartItems.map((item) => item.id)).toEqual(['a', 'b']);
  });
});
