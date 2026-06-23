"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

type CartAction =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE_QTY"; id: string; qty: number }
  | { type: "CLEAR" }
  | { type: "LOAD"; items: CartItem[] };

interface CartState {
  items: CartItem[];
  hydrated: boolean;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD":
      return { items: action.items, hydrated: true };

    case "ADD": {
      const existing = state.items.find((i) => i.id === action.item.id);
      const items = existing
        ? state.items.map((i) =>
            i.id === action.item.id
              ? { ...i, qty: i.qty + action.item.qty }
              : i
          )
        : [...state.items, action.item];
      return { ...state, items };
    }

    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };

    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: action.qty } : i
        ),
      };

    case "CLEAR":
      return { ...state, items: [] };

    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  hydrated: boolean;
  itemCount: number;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY = "allblack-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    hydrated: false,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      dispatch({
        type: "LOAD",
        items: stored ? (JSON.parse(stored) as CartItem[]) : [],
      });
    } catch {
      dispatch({ type: "LOAD", items: [] });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(state.items));
  }, [state.items, state.hydrated]);

  const itemCount = state.items.reduce((sum, i) => sum + i.qty, 0);
  const total = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const addItem = useCallback(
    (item: CartItem) => dispatch({ type: "ADD", item }),
    []
  );
  const removeItem = useCallback(
    (id: string) => dispatch({ type: "REMOVE", id }),
    []
  );
  const updateQty = useCallback(
    (id: string, qty: number) => dispatch({ type: "UPDATE_QTY", id, qty }),
    []
  );
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        hydrated: state.hydrated,
        itemCount,
        total,
        addItem,
        removeItem,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
