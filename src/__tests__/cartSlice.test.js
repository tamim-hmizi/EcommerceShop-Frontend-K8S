import { beforeEach, describe, expect, it, vi } from 'vitest';

// Reducers are pure; the HTTP layer (and the store it imports) is out of scope.
vi.mock('../services/cartService', () => ({}));

import reducer, { addToCart, clearCart, removeFromCart, updateQuantity } from '../redux/slices/cartSlice';

const shoe = { _id: 'p1', name: 'Shoe', price: 50, image: 'shoe.png', stock: 3 };
const empty = { items: [], lastOperationSuccess: true, lastValidated: null, loading: false, error: null, isServerCart: false };

describe('cart reducer', () => {
  beforeEach(() => localStorage.clear());

  it('adds a product with quantity 1 by default', () => {
    const state = reducer(empty, addToCart(shoe));
    expect(state.items).toEqual([{ ...shoe, quantity: 1 }]);
    expect(state.lastOperationSuccess).toBe(true);
  });

  it('merges repeated adds into one line', () => {
    let state = reducer(empty, addToCart(shoe));
    state = reducer(state, addToCart({ ...shoe, quantity: 2 }));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it('caps quantities at the available stock', () => {
    let state = reducer(empty, addToCart({ ...shoe, quantity: 5 }));
    expect(state.items[0].quantity).toBe(3);
    expect(state.lastOperationSuccess).toBe(false);

    state = reducer(state, updateQuantity({ _id: 'p1', quantity: 10 }));
    expect(state.items[0].quantity).toBe(3);
    expect(state.lastOperationSuccess).toBe(false);
  });

  it('updates, removes and clears items', () => {
    let state = reducer(empty, addToCart(shoe));
    state = reducer(state, updateQuantity({ _id: 'p1', quantity: 2 }));
    expect(state.items[0].quantity).toBe(2);
    state = reducer(state, removeFromCart('p1'));
    expect(state.items).toEqual([]);
    state = reducer(reducer(state, addToCart(shoe)), clearCart());
    expect(state.items).toEqual([]);
  });

  it('persists the cart to localStorage', () => {
    reducer(empty, addToCart(shoe));
    expect(JSON.parse(localStorage.getItem('cart')).items[0]._id).toBe('p1');
  });
});
