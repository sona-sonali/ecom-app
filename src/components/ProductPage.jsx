import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Button, Card, CardContent, CardMedia, Grid, Checkbox, FormControlLabel, List, ListItem } from '@mui/material';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../utils/CartSlice';
import { Link, useNavigate } from 'react-router-dom';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate()


  // Fetch all products and categories on page load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data);
        const initialQuantities = response.data.reduce((acc, product) => {
          acc[product.id] = 0; // Set initial quantity to 0 for each product
          return acc;
        }, {});
        setQuantities(initialQuantities);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);


// Fetch products based on categories
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (selectedCategories.length === 0) {
        // Fetch all products if no category is selected
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data);
      } else {
        const promises = selectedCategories.map(category =>
          axios.get(`https://fakestoreapi.com/products/category/${category}`)
        );
        const responses = await Promise.all(promises);
        console.log(responses)
        const filteredProducts = responses.flatMap(response => response.data);
        setProducts(filteredProducts);
      }
    };
    fetchProductsByCategory();
  }, [selectedCategories]);

  
  // To set category
  const handleCategoryChange = (category) => {
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.includes(category)
        ? prevSelectedCategories.filter((c) => c !== category)
        : [...prevSelectedCategories, category]
    );
  };

  //To handle add functionality of products
  const handleAdd = (id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: (prevQuantities[id] || 0) + 1,
    }));
  };
  
  // To handle remove functionality of products
  const handleRemove = (id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: Math.max((prevQuantities[id] || 0) - 1, 0),
    }));
  };

  //To Add products to cart
  const handleAddToCart = (product) => {
    const newQuantity = quantities[product.id] || 0;
    if(newQuantity > 0){
      dispatch(addToCart({...product, quantity: newQuantity}))
      console.log(newQuantity)
      setQuantities((prev)=> ({...prev, [product.id]: 0 }));
    }
    console.log("Added to cart");
  }

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token from local storage
    delete axios.defaults.headers.common['Authorization'] // Remove Authorization header
    navigate('/') // Navigate to Log In page
  }

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={4}>
          <Typography variant="h4">
            ECommerce
          </Typography>
          <Button variant="outlined" color="warning" onClick={handleLogout}>
              Log Out
          </Button>
        </Box>
      <Box display="flex" marginTop={4}>
        <Box width="20%" paddingRight={2}>
          <Typography variant="h4" gutterBottom>
            Categories
          </Typography>
          <List>
            {categories.map((category) => (
              <ListItem key={category}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      name={category}
                    />
                  }
                  label={category}
                />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box width="80%">
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Typography variant="h4" gutterBottom>
              Products
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              <Grid container spacing={4}>
                {products.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.image}
                        alt={product.title}
                        style={{ objectFit: 'contain' }}
                      />
                      <CardContent style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box>
                        <Typography gutterBottom variant="h6" component="div">
                          {product.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          ${product.price}
                        </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" marginY={2}>
                          <Button variant="outlined" color="primary" onClick={() => handleAdd(product.id)}>
                            +
                          </Button>
                          <Typography variant="body1" style={{ margin: '0 10px' }}>
                            {quantities[product.id] || 0}
                          </Typography>
                          <Button variant="outlined" color="secondary" onClick={() => handleRemove(product.id)}>
                            -
                          </Button>
                        </Box>
                        <Box display="flex" alignItems="center" marginTop={2} justifyContent="center">
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleAddToCart(product)}
                          disabled={!quantities[product.id]}
                          style={{marginTop: '10px'}}
                          >
                            Add To Cart
                        </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
        <Box mt={4} marginLeft={4}>
          <Button component={Link} to="/cart" variant="contained" color="primary">
            Go To Cart
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductPage;