import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

import cartReducer from '../store/shopping-cart/cartSlice';
import Cart from './Cart';

const renderCart = (preloadedState) => {
  const store = configureStore({
    reducer: { cart: cartReducer },
    preloadedState: preloadedState && { cart: preloadedState },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    </Provider>
  );
};

describe('Cart page', () => {
  it('hides the subtotal and checkout link when the cart is empty (regression: these used to render even for an empty cart)', () => {
    renderCart();

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.queryByText(/proceed to checkout/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/taxes and shipping/i)).not.toBeInTheDocument();
  });

  it('shows the subtotal and checkout link when the cart has items', () => {
    renderCart({
      cartItems: [
        { id: '1', title: 'Pizza', price: 10, quantity: 2, totalPrice: 20, img: 'pizza.jpg' },
      ],
      totalQuantity: 2,
      totalAmount: 20,
    });

    expect(screen.queryByText(/your cart is empty/i)).not.toBeInTheDocument();
    expect(screen.getByText(/proceed to checkout/i)).toBeInTheDocument();
    expect(screen.getByText(/taxes and shipping/i)).toBeInTheDocument();
  });
});
