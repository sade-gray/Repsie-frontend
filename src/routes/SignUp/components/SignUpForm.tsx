import { Button, CircularProgress, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import useAuth from '@context/AuthProvider';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function SignUpForm(props: any) {
  const [email, setEmail] = useState('');
  /** Password field is made up of its value, valid state and error message all in one variable */
  const [password, setPassword] = useState({ value: '', valid: false, errorMessage: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [pendingSignup, setPendingSignup] = useState(false);

  const { emailSignUp } = useAuth();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const res = isValidPassword(e.target.value);
    setPassword({
      value: e.target.value,
      valid: res.valid,
      errorMessage: res.message,
    });
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.value !== confirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }
    // Try to sign up with the current credentials.
    setPendingSignup(true);
    const authResponse = await emailSignUp(email, password.value);
    setPendingSignup(false);
    // Go to the username & pfp stage if successful, show error otherwise
    if (authResponse.success) {
      console.log('Successfully signed up!');
      props.goToNextStage();
    } else {
      setSignupError('An error has occurred. Try again later.');
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
                value={password.value}
                onChange={handlePasswordChange}
                fullWidth
                required
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle passwor>d visibility"
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
          <Grid container justifyContent={'left'} px={6}>
            {/* Password Error Message */}
            {!password.valid && password.errorMessage !== '' && (
              <Typography variant={'body2'} color={'error'}>
                {password.errorMessage}
              </Typography>
            )}
          </Grid>
        </Grid>

        {/* Confirm Password Field */}
        <Grid container alignItems={'flex-end'}>
          <LockIcon sx={{ color: 'action.active', mr: 2, my: 1.5 }} />
          <Grid item xs={9} md={10}>
            <FormControl sx={{ m: 1 }} variant={'standard'} color={'secondary'} fullWidth>
              <InputLabel htmlFor="confirm-password-field" required>
                Confirm Password
              </InputLabel>
              <Input
                type={showPassword ? 'text' : 'password'}
                id="confirm-password-field"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
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
        </Grid>
        <Grid container justifyContent={'left'} px={6}>
          {signupError !== '' && (
            <Typography variant={'body2'} color={'error'}>
              {signupError}
            </Typography>
          )}
        </Grid>

        {/* Sign in Button */}
        <Button
          fullWidth
          sx={{ borderRadius: 5, mx: 5 }}
          // button is enabled only if all fields are filled, passwords match and the user has not pressed sign up already
          disabled={
            email === '' || password.value === '' || !password.valid || confirmPassword === '' || password.value !== confirmPassword || pendingSignup
          }
          size={'large'}
          variant={'contained'}
          color={'secondary'}
          type={'submit'}
        >
          {pendingSignup ? <CircularProgress size={25} /> : 'Sign up'}
        </Button>
      </Grid>
    </form>
  );
}

interface PasswordValidationResponse {
  valid: boolean;
  message: string;
}

function isValidPassword(password: string) {
  const res: PasswordValidationResponse = {
    valid: false,
    message: '',
  };

  if (password.length < 8) {
    res.message = 'Password must be at least 8 characters';
  } else if (password.search(/[a-z]/) < 0) {
    res.message = 'Password must contain at least one lowercase letter';
  } else if (password.search(/[A-Z]/) < 0) {
    res.message = 'Password must contain at least one uppercase letter';
  } else if (password.search(/[0-9]/) < 0) {
    res.message = 'Password must contain at least one number';
  } else {
    res.valid = true;
  }

  return res;
}
