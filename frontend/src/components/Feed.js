import React, { Component } from 'react';

import axios from "axios";
import { Redirect } from "react-router";
import './styles/Feed.css';


class Feed extends Component {

    constructor(props){
        super(props);
        this.state = {
            "timeline" : []
        }
    }

    componentDidMount(){

        let arrayshuffle = function(a){
            var j, x, i;
            for (i = a.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
            return a;
        }

        let timeline = [];
        var read_post = process.env.REACT_APP_POSTS_READ + "vishumanvi";
        console.log(read_post);
        var proxy = process.env.REACT_APP_PROXY_URL;
        //Incase you want to use this.setState after API call use _this and not this.
        let _this = this;
        window.jQuery.ajax({
            url: proxy + read_post,
            complete:function(data){
                console.log(data);
                console.log(data.responseJSON);
                timeline = data.responseJSON;
                console.log(timeline);
                var newArray = timeline.flat();
                console.log(newArray);
                var shuffledArray = arrayshuffle(newArray);
                console.log(shuffledArray);
                _this.setState({
                    "timeline" : shuffledArray
                })

            }
        });
    
      }
    
      saveComment(e){

        console.log(e);
        console.log(e.target);
        console.log(e.target.parentNode);
        console.log(e.target.tagName);
        let text = "";
        if(e.target.tagName=="IMG"){
            text = e.target.closest("div").childNodes[0].value;
        }
        else{
            text = e.target.closest("div").childNodes[0].value;
        }
        console.log(text);
        //return;
        
        var comment_write = process.env.REACT_APP_COMMENT_WRITE + "/some-user-5" ;
        console.log(comment_write);
        var proxy = process.env.REACT_APP_PROXY_URL;
        //Incase you want to use this.setState after API call use _this and not this.
        let _this = this;
        window.jQuery.ajax({
            data: JSON.stringify({
                "username": "some-user-5",
                "message": "some-comment-6"
            }),
            method: "POST",
            url: proxy + comment_write,
            complete:function(data){
                console.log(data);


            }
        });
      }


    render() {

        console.log(this.state.timeline);
        return (
            <div className="feeds-container container">
                <div class="window">
                    <div class="header">
                        <img src="https://image.flaticon.com/icons/svg/25/25315.svg" width="8%"/>
                        <img src="https://cdn.worldvectorlogo.com/logos/instagram-1.svg" width="25%"/>
                        <img src="https://image.flaticon.com/icons/svg/20/20402.svg" width="8%"/>
                    </div>
                    <div class="main-scroll">
                        {
                            this.state.timeline.map((number) => {
                                return (                       
                                <div class="content" key={+new Date() + Math.random()} >
                                    <div class="post">
                                        <div class="name">
                                            <img src="https://randomuser.me/api/portraits/women/84.jpg" width="10%" height="10%" class="profile-img"/>
                                            <p>{number.Username}</p>
                                        </div>
                                        
                                    </div>
                                    <div class="post-image">
                                        {/* <img src="https://c1.staticflickr.com/4/3851/14948376317_a97232356c_z.jpg" width="100%"/> */}
                                        {
                                            number.Image.indexOf("http") == -1
                                            ? (<img src="https://wolper.com.au/wp-content/uploads/2017/10/image-placeholder.jpg" />)
                                            : (<img src={number.Image} width="100%"/>)
                                        }
                                        
                                        <p>{number.Caption}</p>
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
                                        <p style={{"textAlign":"left"}}>{number.Likes? number.Likes.length : 0} likes &#9679; {number.Comments? number.Comments.length : 0} comments</p>
                                    </div>
                                    {
                                        number.Comments ?
                                        (
                                            <div className="comments">
                                                {
                                                    number.Comments.map((number2) => {
                                                        return (
                                                            <div className="comment-single" key={+new Date() + Math.random()} >
                                                                <span className="commenter">{number2.Username}</span>
                                                                <span className="commented">{number2.Message}</span>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        ):
                                        null
                                    }
                                    
                                    <div className="commentBox">
                                        <textarea className="form-control" data-gramm_editor="false" ></textarea>
                                        <button type="button" className="commentbuttton"  onClick={(e)=>this.saveComment(e)}>
                                            <img src="https://image.flaticon.com/icons/svg/20/20402.svg" width="90%" />
                                        </button>
                                    </div>
                                </div>)
                            }
                          )
                        }


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