import React, { Component } from 'react';
import CSSstyle from './App.module.css';
import Navigation from './Components/Navigation/Navigation';
import Footer from './Components/Footer/Footer';
import ForgotPassword from './Components/ForgotPassoword/ForgotPassword';
import ResetForm from './Components/ResetForm/ResetForm';
import CourseSection from './Components/CourseSection/CourseSection';
import Header from './Components/Header/Header';
import Profile from './Components/Profile/Profile';
import Timeline from './Components/Timeline/Timeline';
import Signin from './Components/Singin/Signin';
import Signup from './Components/Signup/Signup';
import EditProfileForm from './Components/EditProfileForm/EditProfileForm';

export default class App extends Component {
  render() {
    return (
      <div className={CSSstyle.widthHeight}>
        <Navigation />
        <Header />
        <CourseSection />
        <Signin />
        <Signup />
        <Timeline />
        <Profile />
        <EditProfileForm />
        <ResetForm />
        <ForgotPassword />
        <Footer />
      </div>
    )
  }
}

