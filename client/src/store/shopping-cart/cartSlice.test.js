import cartReducer, { cartActions } from './cartSlice';

const initial = { cartItems: [], totalQuantity: 0, totalAmount: 0 };
const pizza = { id: '1', title: 'Pizza', img: 'pizza.jpg', price: 10 };
const burger = { id: '2', title: 'Burger', img: 'burger.jpg', price: 5 };

describe('cartSlice', () => {
  it('adds a new item', () => {
    const state = cartReducer(initial, cartActions.addItem(pizza));

    expect(state.cartItems).toHaveLength(1);
    expect(state.cartItems[0]).toMatchObject({ id: '1', quantity: 1, totalPrice: 10 });
    expect(state.totalQuantity).toBe(1);
    expect(state.totalAmount).toBe(10);
  });

  it('increments quantity when the same id is added again', () => {
    let state = cartReducer(initial, cartActions.addItem(pizza));
    state = cartReducer(state, cartActions.addItem(pizza));

    expect(state.cartItems).toHaveLength(1);
    expect(state.cartItems[0].quantity).toBe(2);
    expect(state.totalAmount).toBe(20);
  });

  it('keeps two different ids as two separate lines (regression: they used to merge because ProductCard dispatched `_id` while this reducer reads `id`, leaving every id undefined)', () => {
    let state = cartReducer(initial, cartActions.addItem(pizza));
    state = cartReducer(state, cartActions.addItem(burger));

    expect(state.cartItems).toHaveLength(2);
    expect(state.totalQuantity).toBe(2);
    expect(state.totalAmount).toBe(15);
  });

  it('removeItem on an id that is not in the cart does not throw or change state (regression: used to crash on existingItem.quantity)', () => {
    const state = cartReducer(initial, cartActions.removeItem('missing'));
    expect(state).toEqual(initial);
  });

  it('removeItem decrements quantity, then removes the line once it hits zero', () => {
    let state = cartReducer(initial, cartActions.addItem(pizza));
    state = cartReducer(state, cartActions.addItem(pizza));

    state = cartReducer(state, cartActions.removeItem('1'));
    expect(state.cartItems[0].quantity).toBe(1);

    state = cartReducer(state, cartActions.removeItem('1'));
    expect(state.cartItems).toHaveLength(0);
    expect(state.totalQuantity).toBe(0);
  });

  it('deleteItem removes the whole line regardless of quantity', () => {
    let state = cartReducer(initial, cartActions.addItem(pizza));
    state = cartReducer(state, cartActions.addItem(pizza));

    state = cartReducer(state, cartActions.deleteItem('1'));
    expect(state.cartItems).toHaveLength(0);
    expect(state.totalAmount).toBe(0);
  });

  it('clearCart resets everything back to empty', () => {
    let state = cartReducer(initial, cartActions.addItem(pizza));
    state = cartReducer(state, cartActions.clearCart());

    expect(state).toEqual(initial);
  });
});
