import { Button, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, TextField, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import React, { useState } from 'react';
import useAuth from '@context/AuthProvider';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  // TODO: Add type.a
  const { emailSignIn } = useAuth();
  // TODO: Disable sign up button until form is valid.

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const navigate = useNavigate();
  // TODO: Redirect only if succesful.
  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await emailSignIn(email, password);
    if (!success) {
      setLoginError('Invalid Credentials. Please try again.');
    } else {
      navigate('');
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container justifyContent={'center'} gap={2}>
        {/* Email field*/}
        <Grid container alignItems={'flex-end'}>
          <EmailIcon sx={{ color: 'action.active', mr: 3, my: 0.5 }} />
          <Grid item xs={9} md={10}>
            <TextField onChange={handleEmailChange} id="email-field" label="Email" variant="standard" color={'secondary'} required fullWidth />
          </Grid>
        </Grid>

        {/* Password Field*/}
        <Grid container alignItems={'flex-end'}>
          <LockIcon sx={{ color: 'action.active', mr: 2, my: 1.5 }} />
          <Grid item xs={9} md={10}>
            <FormControl sx={{ m: 1 }} variant={'standard'} color={'secondary'} fullWidth>
              <InputLabel htmlFor="password-field" required>
                Password
              </InputLabel>
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password-field"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                required
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>

          {/* Forgot password button*/}
          <Grid container justifyContent={'right'}>
            <Button sx={{ textTransform: 'none' }} variant={'text'} color={'secondary'}>
              Forgot password?
            </Button>
          </Grid>
        </Grid>
        {loginError !== '' && <Typography color={'error'}>{loginError}</Typography>}

        {/* Sign in Button */}
        <Button
          fullWidth
          sx={{ borderRadius: 5, mx: 5 }}
          disabled={email === '' && password === ''}
          size={'large'}
          variant={'contained'}
          color={'secondary'}
          type={'submit'}
        >
          Sign in
        </Button>
      </Grid>
    </form>
  );
}
