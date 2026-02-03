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

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [tenantName, setTenantName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <Box sx={{ maxWidth: 520, mx: 'auto', mt: 8 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Register Tenant
        </Typography>

        {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

        <Box
          component="form"
          onSubmit={async (e) => {
            e.preventDefault();
            setError('');
            setLoading(true);
            try {
              await register(tenantName, email, password);
              navigate('/login');
            } catch (err) {
              setError(err.message || 'Registration failed');
            } finally {
              setLoading(false);
            }
          }}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField label="Tenant Name" value={tenantName} onChange={(e) => setTenantName(e.target.value)} required />
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </Button>

          <Typography variant="body2">
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
