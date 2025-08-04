
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      res.data.role === 'admin' ? navigate('/admin') : navigate('/user');
    } catch {
      alert('Login failed');
    }
  };
  return (
    <Container maxWidth="sm"><Box mt={10} p={4} boxShadow={3}>
      <Typography variant="h4" mb={2}>Login</Typography>
      <TextField fullWidth label="Username" value={username}
        onChange={e => setUsername(e.target.value)} />
      <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleLogin}>
        Login
      </Button>
    </Box></Container>
  );
}
