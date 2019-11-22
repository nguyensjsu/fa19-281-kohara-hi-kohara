import React, {Component} from "react";
import axios from "axios";
import { Redirect } from "react-router";
import './styles/Profile.css';

import S3FileUpload from 'react-s3';
import ReactS3 from 'react-s3';
import uuid from 'react-uuid'
//Optional Import
import { uploadFile } from 'react-s3';


class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        firstname: "",
        lastname: "",
        email: "",
        password: ""
      },
      errors: {},
      dbErrors: ""
    };

    this.submitPost = this.submitPost.bind(this);
  }

  doSubmit = () => {

  };


  componentDidMount(){


    console.log(this.props);
    let user = "some-user-0";
    try{
        if(this.props.match.params.id){
            user = this.props.match.params.id;
        }
        else{
            //GET FROM LS
            //user = localStorage.getItem("")
        }
    }
    catch(e){
        user = "some-user-0";
        console.log(e);
    }



    //var read_post = process.env.REACT_APP_POSTS_READ;
    //console.log(read_post);
    var proxy = process.env.REACT_APP_PROXY_URL;

    var read_post = process.env.REACT_APP_POSTS_READ + user;
    
    var proxy = process.env.REACT_APP_PROXY_URL;
    
    let _this = this;
    window.jQuery.ajax({
        url: proxy + read_post,
        complete:function(data){
            _this.setState({
                "posts": data.responseJSON 
            })
            console.log(data);
        }
    });



    //Onesignal
    const method = "POST"
    const headers = {
      "Content-type": "application/json",
      "Authorization": "Basic ODlkMmIyYWItYzZjNy00ZGU3LThiZjAtNGE1MTIwMGUwMTlh"
    }
  
    const body = JSON.stringify({
      "app_id" : "2041fdc7-a90d-45fe-984c-8986664cbd2e",
      "contents": {"en": "Hello World!"} ,
      //"include_player_ids" : ["9589293b-a616-488f-9fa8-e793bbbe6441","6e0c6067-4492-4ccd-81d4-3181950e4550"]
      "filters" : [
        // {"field": "tag", "key": "cat", "relation": "=", "value": "1273812371283"} ,
        // {"operator": "OR"}, {"field": "amount_spent", "relation": ">", "value": "0"}
        {"field": "tag", "key": "cat", "relation": "=", "value": "1273812371283"},
        
                   
      ]
    }) 
  
    const handleAsText = response => response.text()

    // const demo = document.getElementById("demo")
    // return fetch("https://onesignal.com/api/v1/notifications", {method, headers, body})
    //   .then(handleAsText)
    //   .then(responseText => {
    //       console.log(responseText);
    //   });




  }


  openModal(){
    window.jQuery('#modal-toggle').toggleClass('active');
  }

  closeModal(){
    window.jQuery('#modal-toggle').toggleClass('active');
  }

  submitPost(e) {
       //console.log(e.target.files);
        const config = {
            bucketName: process.env.REACT_APP_BUCKET_URL,
            region:  process.env.REACT_APP_BUCKET_REGION,
            accessKeyId:  process.env.REACT_APP_BUCKET_ACCESS_KEY,
            secretAccessKey:  process.env.REACT_APP_BUCKET_SECRET
        }
         
        if(document.querySelector("#name").files.length==0        )
        {
            alert("Please select a file...");
            return;
        }
        var file = document.querySelector("#name").files[0]            //e.target.files[0];

        const name = uuid() + // Concat with file extension.
        file.name.substring(file.name.lastIndexOf('.'));
        file = new File([file], name, { type: file.type });
        console.log(file);
        ReactS3.uploadFile(file, config).
            then(d=>{
                console.log(d)
                console.log(process.env.REACT_APP_CLOUDFRONT_URL+"/"+d.key);
            }).
            catch(er=>console.log(er));
  }


  render() {

    console.log(this.state);
    return (
      <div className="feeds-container container exts">
          <header>
              

<div class="container ">

    <div class="profile">

        <div class="profile-image">

            <img src="https://images.unsplash.com/photo-1513721032312-6a18a42c8763?w=152&h=152&fit=crop&crop=faces" alt="" />

        </div>

        <div class="profile-user-settings">

            <h1 class="profile-user-name">janedoe_</h1>

            <button class="btn profile-edit-btn">Follow</button>

            {/* <button class="btn profile-settings-btn" aria-label="profile settings"><i class="fas fa-cog" aria-hidden="true"></i></button> */}

        </div>

        <div class="profile-stats">

            <ul>
                <li><span class="profile-stat-count">{parseInt(Math.random()*100)}</span> posts</li>
                <li><span class="profile-stat-count">{parseInt(Math.random()*100)}</span> followers</li>
                <li><span class="profile-stat-count">{parseInt(Math.random()*100)}</span> following</li>
            </ul>

        </div>

        <div class="profile-bio">

            <p><span class="profile-real-name">Hello World!</span> </p>

        </div>

    </div>


</div>


</header>

<main>

<div class="container">

    <div class="gallery">


        {
            this.state.posts ? this.state.posts.map((number) => {
                return ( 
                    <div class="gallery-item" tabindex="0">

                    {/* <img src="https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?w=500&h=500&fit=crop" class="gallery-image" alt=""/> */}
                    {
                        number.Image.indexOf("http") == -1
                        ? (<img src="https://wolper.com.au/wp-content/uploads/2017/10/image-placeholder.jpg" class="gallery-image" alt="" />)
                        : (<img src={number.Image}  class="gallery-image" alt=""/>)
                    }


                    <div class="gallery-item-info">
        
                        <ul>
                            <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i>{number.Likes? number.Likes.length : 0}</li>
                            <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i> {number.Comments? number.Comments.length : 0}</li>
                        </ul>
        
                    </div>
        
                </div>
                )
            }) : null
        }

 
         

    </div>


   

</div>


</main>
       

    <button className="upload-image instagradient" onClick={this.openModal}>
        +
        
    </button>


        <div class="modal-container">
            <input id="modal-toggle" type="checkbox" />
             
            <label class="modal-backdrop" for="modal-toggle"></label>
            <div class="modal-content">
                <label class="modal-close" onClick={this.closeModal}>&#x2715;</label>
                <h2>Create Post</h2><hr />
                <p>Upload Image and Set a caption here!</p> 

                <input type="file" id="name" name="file" className="form-control"  /><br/>

                <textarea id="caption" name="caption"  className="form-control" placeholder="Enter caption..."></textarea><br/>

                <button type="button" onClick={this.submitPost}  className="btn instagradient logbtn" >Post to Instagram</button><br/>
                {/* <label class="modal-content-btn" for="modal-toggle">OK</label>    */}
            </div>          
        </div>  



      </div>
    );
  }
}

export default Profile;
