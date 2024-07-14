import { createSlice } from '@reduxjs/toolkit';


const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: []
    },
    reducers: {
        addToCart: (state, action) => {
            const item = state.items.find(item => item.id === action.payload.id);
            item ? item.quantity += 1 : state.items.push({...action.payload, quantity: 1})
        },

        removeFromCart: (state, action) => {
            const index=state.items.findIndex(item => item.id === action.payload);
            if(index !== -1) {
                if(state.items[index].quantity > 1) {
                    state.items[index].quantity -= 1;
                } else {
                    state.items.splice(index, 1);
                }
            }
        }
    }
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;