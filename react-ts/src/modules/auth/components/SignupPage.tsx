import * as React from 'react';
import { useNavigate } from "react-router-dom"
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import useFormFields from '../../../use/form-fields';
import useUserStore from '../store';

import { ISignupState } from '../model'

export default function LoginPage() {
  const { state, setField, onValueChange } = useFormFields({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
    isPwdConfirmed: false
  } as ISignupState)
  const { error, data, isAuthed, signupUser } = useUserStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (state.password === state.passwordConfirm) {
      setField({ isPwdConfirmed: true })
    }
  }, [state.password, state.passwordConfirm])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signupUser?.({ 
      firstName: state.firstName,
      lastName: state.lastName,
      username: state.username, 
      email: state.email, 
      userType: 'admin',
      password: state.password,
    }).then(() => {
      console.log('isAuthed', isAuthed)
      if (isAuthed) {
        navigate("/");
      }
    });
  }
  
  return (
    <Grid
      container
      spacing={2}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '80vh' }}
    >
      <Grid item xs={5}>
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent>
              <Grid 
                container
                spacing={2}
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <Grid item>
                  <TextField 
                    name="firstName"
                    label="First Name" 
                    variant="outlined" 
                    size="small"
                    fullWidth
                    value={state.firstName}
                    onChange={onValueChange}
                  />
                </Grid>
                <Grid item>
                  <TextField 
                    name="lastName"
                    label="Last Name" 
                    variant="outlined" 
                    size="small"
                    fullWidth
                    value={state.lastName}
                    onChange={onValueChange}
                  />
                </Grid>
                <Grid item>
                  <TextField 
                    name="username"
                    label="Username" 
                    variant="outlined" 
                    size="small"
                    fullWidth
                    value={state.username}
                    onChange={onValueChange}
                  />
                </Grid>
                <Grid item>
                  <TextField 
                    name="email"
                    label="Email" 
                    variant="outlined" 
                    size="small"
                    fullWidth
                    value={state.email}
                    onChange={onValueChange}
                  />
                </Grid>
                <Grid item>
                  <TextField 
                    name="password"
                    label="Password" 
                    variant="outlined" 
                    type="password" 
                    size="small"
                    fullWidth
                    value={state.password}
                    onChange={onValueChange}
                  />
                </Grid>
                <Grid item>
                  <TextField 
                    name="passwordConfirm"
                    label="Confirm Password" 
                    variant="outlined" 
                    type="password" 
                    size="small"
                    fullWidth
                    value={state.passwordConfirm}
                    onChange={onValueChange}
                  />
                </Grid>
              </Grid>
              
              {error && 
                <Typography className="errorText">{error}</Typography>}
              {data?.message && 
                <Typography className="errorText">{data?.message}</Typography>}
            </CardContent>
            <CardActions>
              <Button 
                variant="contained" 
                type="submit"
              >
                Login
              </Button>
              <Button variant="text">Cancel</Button>
            </CardActions>
          </Card>
        </form>
      </Grid>   
    </Grid> 
  );
}
