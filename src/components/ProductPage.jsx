import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Button, Card, CardContent, CardMedia, Grid, Checkbox, FormControlLabel, List, ListItem } from '@mui/material';
import axios from 'axios';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});


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
      [id]: prevQuantities[id] + 1,
    }));
  };
  
  // To handle remove functionality of products
  const handleRemove = (id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: Math.max(prevQuantities[id] - 1, 0),
    }));
  };

  return (
    <Container maxWidth="lg">
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
                        <Box display="flex" alignItems="center" marginTop={2}>
                          <Button variant="contained" color="primary" onClick={() => handleAdd(product.id)}>
                            +
                          </Button>
                          <Typography variant="body1" style={{ margin: '0 10px' }}>
                            {quantities[product.id]}
                          </Typography>
                          <Button variant="contained" color="secondary" onClick={() => handleRemove(product.id)}>
                            -
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
      </Box>
    </Container>
  );
};

export default ProductPage;