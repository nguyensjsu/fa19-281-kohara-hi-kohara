import React, { Component } from 'react';

import axios from "axios";
import { Redirect } from "react-router";
import './styles/Feed.css';


class Feed extends Component {
    render() {
        return (
            <div className="feeds-container container">
                <div class="window">
                    <div class="header">
                        <img src="https://image.flaticon.com/icons/svg/25/25315.svg" width="8%"/>
                        <img src="https://cdn.worldvectorlogo.com/logos/instagram-1.svg" width="25%"/>
                        <img src="https://image.flaticon.com/icons/svg/20/20402.svg" width="8%"/>
                    </div>
                    <div class="main-scroll">

                        <div class="content">
                            <div class="post">
                                <div class="name">
                                    <img src="https://randomuser.me/api/portraits/women/84.jpg" width="10%" height="10%" class="profile-img"/>
                                    <p>Danielle Pierce</p>
                                </div>
                                 
                            </div>
                            <div class="post-image">
                                <img src="https://c1.staticflickr.com/4/3851/14948376317_a97232356c_z.jpg" width="100%"/>
                            </div>
                            <div class="likes">
                                <div class="left-icons">
                                    <img src="https://image.flaticon.com/icons/svg/25/25424.svg" width="8%"/>
                                    <img src="https://image.flaticon.com/icons/svg/54/54916.svg" width="8%"/>
                                    {/* <img src="https://image.flaticon.com/icons/svg/126/126536.svg" width="8%"/> */}
                                </div>
                                
                            </div>
                            <div class="like-count">
                                {/* <img src="https://image.flaticon.com/icons/svg/60/60993.svg" width="4%"/> */}
                                <p style={{"textAlign":"left"}}>24 likes &#9679; 5 comments</p>
                            </div>
                        </div>
                        <div class="content">
                            <div class="post">
                                <div class="name">
                                    <img src="https://randomuser.me/api/portraits/women/84.jpg" width="10%" height="10%" class="profile-img"/>
                                    <p>Danielle Pierce</p>
                                </div>
                                
                            </div>
                            <div class="post-image">
                                <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/nature-quotes-1557340276.jpg?crop=0.666xw:1.00xh;0.168xw,0&resize=640:*" width="100%"/>
                            </div>
                            <div class="likes">
                                <div class="left-icons">
                                    <img src="https://image.flaticon.com/icons/svg/25/25424.svg" width="8%"/>
                                    <img src="https://image.flaticon.com/icons/svg/54/54916.svg" width="8%"/>
                                    {/* <img src="https://image.flaticon.com/icons/svg/126/126536.svg" width="8%"/> */}
                                </div>
                                
                            </div>
                            <div class="like-count">
                                {/* <img src="https://image.flaticon.com/icons/svg/60/60993.svg" width="4%"/> */}
                                <p style={{"textAlign":"left"}}>24 likes &#9679; 5 comments</p>
                            </div>
                        </div>

                    </div>
                    
                    
                    <div class="footer">
                        <img src="https://image.flaticon.com/icons/svg/20/20176.svg" width="8%"/>
                        <img src="https://image.flaticon.com/icons/svg/149/149852.svg" width="8%"/>
                        <img src="https://image.flaticon.com/icons/svg/25/25668.svg" width="8%"/>
                        <img src="https://image.flaticon.com/icons/svg/60/60993.svg" width="8%"/>
                        <img src="https://image.flaticon.com/icons/svg/64/64096.svg" width="8%"/>
                    </div>
                    </div>
 
            </div>
        );
    }
}

export default Feed;