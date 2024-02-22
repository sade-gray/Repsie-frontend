import { Email, Password } from '@mui/icons-material';
import './ProfilePage.css';
import { useState } from 'react';

//import {useAuth} from '@context/AuthProvider';



export default function ProfilePage() {
    const [Birthdate,setBirthdate]= useState("");
    

    return (
        <><div>
            <input type='file' id='file' name='ProfilePic' accept='image/*' required></input>
            <label htmlFor='file'>Choose a profile picture</label>
            <table>
                <th>Personal Information
                </th>
                <tbody>
                <tr>
                    <td>Username:</td>
                    <td><input type="text" id="username" name="username" required></input></td>
                </tr>
                <tr>
                    <td>Birthdate:</td>// adding required
                    <td>{Birthdate}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td></td> //adding required
                
                </tr>
                <tr>
                    <td>Password</td>
                    </tr>
                    <tr>
                        <button>Save Changes</button>
                    </tr>
                    </tbody>
            </table>
        </div>
         <div>
            <h2 id="srecipes"> Saved Recipes </h2>
            


            </div>
            <div>
                <h3 id="rhistory">Recipe History</h3>
                </div>            
            
            
            
            
            </>


);
}