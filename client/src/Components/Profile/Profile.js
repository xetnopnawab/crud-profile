    import React from 'react';
    import CSSstyle from './Profile.module.css';
    import { Container, Typography, TextField, Button, Divider } from '@material-ui/core';
    import EditProfileHeader from '../EditProfileHeader/EditProfileHeader';
    import Post from '../Post/Post';

    function Profile() {
        return (
            <Container>
                <EditProfileHeader /> 
                <Typography className={CSSstyle.thin} variant="h6" >Change the world with your thoughts...</Typography>
                <TextField
                type="text"
                placeholder="Your thoughts..."
                multiline
                fullWidth
                margin="normal"
                rows={3}
                variant="outlined"
            />
            <Button variant="contained" className={CSSstyle.bgcolor}> Show The World </Button> 
            <Divider style={{margin: '1em 0'}} />
            <Typography variant="h6" color="textSecondary" >Personal Timeline</Typography>
            <Post />
            </Container>
        )
    }

    export default Profile
