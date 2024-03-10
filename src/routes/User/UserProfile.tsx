import React from 'react'
import { useParams } from 'react-router-dom'
import './UserProfile.css'

import SingleBanner from '../../components/Banners/SingleBanner';
import UserSidebar from '../../components/UserProfile/UserSidebar';
import AccountSettings from '../../components/UserProfile/AccountSettings';
import ChangePassword from '../../components/UserProfile/ChangePassword';
import LegalNotice from '../../components/UserProfile/LegalNotice';

const UserProfile = () => {

    const {activepage} = useParams()


    // alert(activepage)
  return (
    <div className='userprofile'>
     
        <SingleBanner 
        heading={`My Profile`}
        bannerimage = 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80' 
        />
        {/* UserProfile , showing {activepage}
         */}

         <div className='userprofilein'>
            <div className='left'>
              <UserSidebar activepage={activepage ?? ''}/>
            </div>
            <div className='right'>
              {activepage === 'accountsettings' && <AccountSettings/>}
              {activepage === 'changepassword' && <ChangePassword/>}
              {activepage === 'legalnotice' && <LegalNotice/>}
            </div>
            </div>
    </div>
    
  )
}

export default UserProfile