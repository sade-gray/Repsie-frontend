import './ProfilePage.css';
import { useState } from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

//import {useAuth} from '@context/AuthProvider';

export function ProfilePage() {
  const [birthdate, setBirthdate] = useState('');
  setBirthdate('01/01/2000');

  return (
    <>
      <AppBar id="navi" position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/">
            Repsie
          </Typography>
          <Typography variant="h6" component={Link} to="/ProfilePage">
            Profile
          </Typography>
          <Typography variant="h6" component={Link} to="/saverecipes">
            Recipes
          </Typography>
          <Typography variant="h6" component={Link} to="/followers">
            Followers
          </Typography>
          <Typography variant="h6" component={Link} to="/Account">
            Account
          </Typography>
        </Toolbar>
      </AppBar>

      <input type="file" id="file" name="ProfilePic" accept="image/*" required></input>
      <label htmlFor="file">Choose a profile picture</label>
      <table>
        <th id="pi">Personal Information</th>
        <tbody>
          <tr>
            <td>Username:</td>
            <td>
              <input type="text" id="username" name="username" required></input>
            </td>
          </tr>
          <tr>
            <td>Birthdate:</td>// adding required
            <td>{birthdate}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td></td> //adding required
          </tr>
          <tr>
            <td>Password</td>
          </tr>
          <tr>
            <button id="button">Save Changes</button>
          </tr>
        </tbody>
      </table>
      {/*
         <div>
            <h2 id="srecipes"> Saved Recipes </h2>
            import { useEffect, useState } from 'react';
            import { saveRecipes } from 'api'; // Assuming you have an API function to fetch saved recipes


            </div>

            {/*<div>
                <h3 id="rhistory">Recipe History</h3>
                import { useEffect, useState } from 'react';
                import { getRecentRecipes } from 'api'; // Assuming you have an API function to fetch recent recipes

            </div>
    */}
    </>
  );
}
