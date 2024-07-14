import { Typography, Container } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {

    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
    }, [navigate])
    
    //Will be called on click of login button 
    const handleLogin = async() => {
        try{
            const payload = JSON.stringify({
                username,
                password
            })
            const response = await axios.post('https://fakestoreapi.com/auth/login',payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const token = response.data.token;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log('Log In Successfully,token:', token)
            navigate('/product')
        } catch(error) {
            console.log('Error logging in:', error)
        }
    };


    return(
        <Container maxWidth="sm">
     <Box display="flex" flexDirection='column' alignItems="center" justifyContent="center" height="50vh"
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
    >
        <Typography variant="h4" gutterBottom>
            Login
        </Typography>
            <h2>Welcome Back!</h2>
            <TextField
             id="filled-search"
             margin="normal"
             label="Email"
             value={username}
             onChange={(e) => setUserName(e.target.value)}
             variant="outlined"
            />
            <TextField
             id="filled-search"
             label="Password"
             variant="outlined"
             type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleLogin}>
                Log In
            </Button>
    </Box>
        </Container>
    )
}

export default LandingPage