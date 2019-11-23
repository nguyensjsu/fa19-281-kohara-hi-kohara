import React, { Component } from 'react';

import axios from "axios";
import { Redirect } from "react-router";
import './styles/Feed.css';
import { Link } from 'react-router-dom'

class Feed extends Component {

    constructor(props){
        super(props);
        this.state = {
            "timeline" : []
        }

        this.redir = this.redir.bind(this);
    }

    componentDidMount(){

        if(localStorage.getItem("Username")){
            //window.location.href = "/feed";
          }
          else{
            window.location.href = "/";
          }

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
        var read_post = process.env.REACT_APP_TIMELINE_READ + (localStorage.getItem("Username")?localStorage.getItem("Username"):"vishumanvi");
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
                if(data.responseJSON){
                    console.log(timeline);
                    var newArray = timeline.flat();
                    console.log(newArray);
                    var shuffledArray = arrayshuffle(newArray);
                    console.log(shuffledArray);
                    _this.setState({
                        "timeline" : shuffledArray
                    });
                }
                else{
                    _this.setState({
                        "timeline" : []
                    });
                }
                

            }
        });
    
      }
    
      saveComment(e,e2){
 
        let text = "";
        if(e.target.tagName=="IMG"){
            text = e.target.closest("div").childNodes[0].value;
        }
        else{
            text = e.target.closest("div").childNodes[0].value;
        }
        console.log(text);
        //return;
        if(text.toString().trim().length==0){
            alert("Please enter an input")
            return;
        }
        
        var comment_write = process.env.REACT_APP_COMMENT_WRITE + "/" + e2 ;
        console.log(comment_write);
        var proxy = process.env.REACT_APP_PROXY_URL;
        //Incase you want to use this.setState after API call use _this and not this.
        let _this = this;
        window.jQuery.ajax({
            data: JSON.stringify({
                "username": (localStorage.getItem("Username")?localStorage.getItem("Username"):"."),
                "message": text
            }),
            method: "POST",
            url: proxy + comment_write,
            complete:function(data){
                console.log(data);
                alert("Posted successfully");

                window.location.reload();
            }
        });
      }

      redir(){
            this.props.history.push({
                pathname: "/profile"
            })
      }

      addLike(e,d){
        
        console.log(e);
        e.target.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnIStixb-nC68ISl4XQa_tRqbN9muWu90DB8aQfqLg7t6hLvp4BQ&s";
        var like_write = process.env.REACT_APP_LIKE_WRITE + "/" + d ;
        console.log(like_write);
        var proxy = process.env.REACT_APP_PROXY_URL;
        //Incase you want to use this.setState after API call use _this and not this.
        let _this = this;
        window.jQuery.ajax({
            data: JSON.stringify({
                "username": (localStorage.getItem("Username")?localStorage.getItem("Username"):"."),
            }),
            method: "POST",
            url: proxy + like_write,
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
                                if(number){
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
                                            <img src="https://image.flaticon.com/icons/svg/25/25424.svg" width="8%" onClick={(e)=>this.addLike(e,number.ID)}/>
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
                                        <textarea rows="1" className="form-control" data-gramm_editor="false" ></textarea>
                                        <button type="button" className="commentbuttton" data-postid={number.ID}  onClick={(e)=>this.saveComment(e,number.ID)}>
                                            <img src="https://image.flaticon.com/icons/svg/20/20402.svg" width="90%" />
                                        </button>
                                    </div>
                                </div>)
                                }
                            }
                          )
                        }


                    {
                        this.state.timeline ?

                        this.state.timeline[0]==null || this.state.timeline.length==0 ?
                        (
                            <div className="no-posts"><img src="data:image/png;base64,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"></img><br/>No Posts found!</div>
                        ):null
                        :null
                    }



                    </div>
                    
                    
                    <div class="footer">
                        <img src="https://image.flaticon.com/icons/svg/20/20176.svg" width="8%"/>
                        <img src="https://image.flaticon.com/icons/svg/149/149852.svg" width="8%"/>
                        <img src="https://image.flaticon.com/icons/svg/25/25668.svg" width="8%"/>
                        <img src="https://image.flaticon.com/icons/svg/60/60993.svg" width="8%"/>
                        <img src="https://image.flaticon.com/icons/svg/64/64096.svg" width="8%" onClick={this.redir}/>
                    </div>
                    </div>


 
            </div>
        );
    }
}

export default Feed;