import * as React from 'react';
import { useNavigate } from "react-router-dom"
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import useFormField from '../../../use/form-field';
import useUserStore from '../store';

export default function LoginPage() {
  const [username, onUsernameChange] = useFormField('', 500);
  const [password, onPasswordChange] = useFormField('', 500);
  const { error, data, isAuthed, loginUser } = useUserStore();
  const navigate = useNavigate();

  type TSubmit = React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
  const handleSubmit: TSubmit = async (e) => {
    await loginUser?.({ username, password }); // lol pangit tan awon 
    if (isAuthed) {
      navigate("/");
    }
  }
  
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '80vh' }}
    >

      <Grid item xs={3}>
        <Card>
          <CardContent>
            <Stack
              component="form"
              spacing={2}
              noValidate
              autoComplete="off"
            >
              <TextField 
                label="Username" 
                variant="outlined" 
                size="small"
                fullWidth
                value={username}
                onChange={onUsernameChange}
              />
              <TextField 
                label="Password" 
                variant="outlined" 
                type="password" 
                size="small"
                fullWidth
                value={password}
                onChange={onPasswordChange}
              />
              {error && 
                <Typography className="errorText">
                  {error}
                </Typography>}
              {data?.message &&
                <Typography className="errorText">
                  {data?.message}
                </Typography>}
            </Stack>
          </CardContent>
          <CardActions>
            <Button 
              variant="contained" 
              onClick={handleSubmit}
            >
              Login
            </Button>
            <Button variant="text">Cancel</Button>
          </CardActions>
        </Card>
      </Grid>   
    </Grid> 
  );
}
