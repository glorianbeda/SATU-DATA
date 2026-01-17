import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem("inventory_cart");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to parse cart from local storage", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("inventory_cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to local storage", e);
    }
  }, [cartItems]);

  const addToCart = (asset) => {
    setCartItems((prev) => {
      if (prev.find((item) => item.id === asset.id)) {
        return prev;
      }
      return [...prev, asset];
    });
  };

  const removeFromCart = (assetId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== assetId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isInCart = (assetId) => {
    return cartItems.some((item) => item.id === assetId);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, isInCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
