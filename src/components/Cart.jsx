import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, Box, Button, IconButton, Grid, Card, CardContent } from '@mui/material';
import { Close } from '@mui/icons-material';
import axios from 'axios';
import { addToCart, clearCart, removeFromCart, initializeCart } from '../utils/CartSlice';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const Cart = () => {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    try {
      const parsedCartItems = JSON.parse(savedCartItems);
      if (parsedCartItems) {
        dispatch(initializeCart(parsedCartItems));
      }
    } catch (error) {
      console.error('Error parsing cart items from localStorage:', error.message);
    }
  }, [dispatch]);

  // Save cart items to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])

  const handleAddToCart = async (item) => {
    const newQuantity = item.quantity ? item.quantity + 1 : 1
    try {
      await axios.patch(`https://fakestoreapi.com/carts/7`, {
        userId: 3,
        date: new Date().toISOString(),
        products:[{ productId: item.id, quantity: newQuantity}]
      });
      dispatch(addToCart({...item, quantity: item.quantity + 1}));
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handleRemoveFromCart = async (item) => {
    try {
      await axios.patch(`https://fakestoreapi.com/carts/7`, {
        userId: 3,
        date: new Date().toISOString(),
        products:[{ productId: item.id, quantity: item.quantity - 1}]
      });
      dispatch(removeFromCart(item.id));
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handleClearCartItem = async (itemId) => {
    try {
      await axios.patch(`https://fakestoreapi.com/carts/7`, {
        userId: 3,
        date: new Date().toISOString(),
        products:[{ productId: itemId, quantity: 0}]
      });
      dispatch(clearCart(itemId));
    } catch (error) {
      console.error('Error clearing cart item:', error);
    }
  };

  return (
    <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={4}>
          <Typography variant="h4">
            Cart
          </Typography>
          <IconButton component={Link} to="/product" color="success">
            <Close />
          </IconButton>
        </Box>
      {cartItems.length===0 ? (<h1>Your Cart is Empty!</h1>) : (
      <Grid>
        {cartItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card>
             <CardContent>
               <Box display="flex" justifyContent="space-between" width="100%">
                <Box display="flex" flexDirection="column">
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography variant="body2">Price: ${item.price}</Typography>
                </Box>
              <Box display="flex" alignItems="center">
                <Button variant="contained" color="primary" onClick={() => handleAddToCart(item)}>
                  +
                </Button>
                <Typography variant="body2" color="textSecondary" marginLeft={2} marginRight={2}>
                    {item.quantity || 0}
                </Typography>
                <Button variant="contained" color="secondary" onClick={() => handleRemoveFromCart(item)} style={{ marginLeft: '10px' }}>
                  -
                </Button>
                <Button variant="contained" color="error" onClick={() => handleClearCartItem(item.id)} style={{ marginLeft: '10px' }}>
                  X
                </Button>
               </Box>
              </Box>
             </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      )};
    </Container>
  );
};

export default Cart;
