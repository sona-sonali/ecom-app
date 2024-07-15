import { createSlice } from '@reduxjs/toolkit';


const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: []
    },
    reducers: {
        addToCart: (state, action) => {
            const item = state.items.find(item => item.id === action.payload.id);
            if(item) {
                item.quantity += action.payload.quantity
            } else{
                state.items.push({ ...action.payload, quantity: action.payload.quantity })
            }  
            localStorage.setItem('cartItems', JSON.stringify(state.items))
        },

        removeFromCart: (state, action) => {
            const index=state.items.findIndex(item => item.id === action.payload);
            if(index !== -1) {
                if(state.items[index].quantity > 1) {
                    state.items[index].quantity -= 1;
                } else {
                    state.items.splice(index, 1);
                }
                localStorage.setItem('cartItems', JSON.stringify(state.items))
            }
        },

        clearCart: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
                localStorage.setItem('cartItems', JSON.stringify(state.items))
        },

        initializeCart: (state,action) => {
            state.items = action.payload
        }
    }
});

export const { addToCart, removeFromCart, clearCart, initializeCart } = cartSlice.actions;
export default cartSlice.reducer;