import React, { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let i = 0; i < 300 + 1; i++) {
        cart[i] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) => {
    const [all_product, setAll_product] = useState([])
    const [cartItems, setCartItems] = useState(getDefaultCart())


    const fetchAllProducts = async () => {
        const res = await fetch("http://localhost:4000/allproducts")
        const data = await res.json();
        setAll_product(data)
    }

    const fetchCartData = async () => {
        const res = await fetch("http://localhost:4000/getcart", {
            method: "POST",
            headers: {
                Accept: "application/form-data",
                "Content-Type": "application/json",
                'auth-token': `${localStorage.getItem('auth-token')}`
            },
            body: ""
        })
        const data = await res.json()
        setCartItems(data)
    }

    useEffect(() => {
        fetchAllProducts()
        if (localStorage.getItem('auth-token')) {
            fetchCartData()
        }
    }, [])


    // Add to cart
    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        // console.log(`${itemId} added to cart`)
        // console.log(cartItems)
        if (localStorage.getItem('auth-token')) {
            fetch("http://localhost:4000/addtocart", {
                method: "POST",
                headers: {
                    Accept: "application/form-data",
                    "Content-Type": "application/json",
                    'auth-token': `${localStorage.getItem('auth-token')}`
                },
                body: JSON.stringify({ "itemId": itemId })
            })
                .then((res) => res.json())
                .then(data => toast.success(data.message))
        }
    }


    // Remove an Item
    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (localStorage.getItem('auth-token')) {
            fetch("http://localhost:4000/removefromcart", {
                method: "POST",
                headers: {
                    Accept: "application/form-data",
                    "Content-Type": "application/json",
                    'auth-token': `${localStorage.getItem('auth-token')}`
                },
                body: JSON.stringify({ "itemId": itemId })
            })
                .then((res) => res.json())
                .then(data => toast.success(data.message))
        }
    }


    // To get total amount of Cart
    const getTotalCartAmount = () => {
        let totalAmount = 0
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item))
                totalAmount += itemInfo.new_price * cartItems[item]
            }
        }
        return totalAmount;
    }


    // To get total count of Cart icon
    const getTotalCartItems = () => {
        let totalItem = 0
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item]
            }
        }
        return totalItem;
    }

    const contextValue = { all_product, cartItems, addToCart, removeFromCart, getTotalCartAmount, getTotalCartItems }

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
