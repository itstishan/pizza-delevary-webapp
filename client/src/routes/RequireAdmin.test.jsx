import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import authReducer from '../store/author/authSlice';
import RequireAdmin from './RequireAdmin';

const renderWithUser = (user) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { user, token: null } },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/addfoods']}>
        <Routes>
          <Route
            path="/addfoods"
            element={
              <RequireAdmin>
                <div>Admin Page</div>
              </RequireAdmin>
            }
          />
          <Route path="/home" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('RequireAdmin route guard', () => {
  it('redirects a logged-out visitor away from an admin-only route', () => {
    renderWithUser(null);
    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Page')).not.toBeInTheDocument();
  });

  it('redirects a logged-in non-admin user away too', () => {
    renderWithUser({ isAdmin: false });
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('lets an admin user through', () => {
    renderWithUser({ isAdmin: true });
    expect(screen.getByText('Admin Page')).toBeInTheDocument();
  });
});
