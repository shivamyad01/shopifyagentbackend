import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const { login, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', mt: 10 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Login
        </Typography>

        {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

        <Box
          component="form"
          onSubmit={async (e) => {
            e.preventDefault();
            setError('');
            setLoading(true);
            try {
              const u = await login(email, password);
              navigate(u?.role === 'super_admin' ? '/admin' : '/app');
            } catch (err) {
              setError(err.message || 'Login failed');
            } finally {
              setLoading(false);
            }
          }}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </Button>

          <Typography variant="body2">
            Don’t have an account? <Link to="/register">Register</Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
