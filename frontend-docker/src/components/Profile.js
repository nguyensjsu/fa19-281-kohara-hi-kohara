import React, {Component} from "react";
import axios from "axios";
import { Redirect } from "react-router";
import './styles/Profile.css';

import S3FileUpload from 'react-s3';
import ReactS3 from 'react-s3';
import uuid from 'react-uuid'
//Optional Import
import { uploadFile } from 'react-s3';

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

let images = [
    'https://d2xa19dgrtgu1f.cloudfront.net/72d10c-238e-7470-f14-8febbb3d7af.jpg',
  ];


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
      dbErrors: "",
      lightBox: false,
      followers: 0,
      following: 0,
      followerData : []
    };

    this.submitPost = this.submitPost.bind(this);
    this.showImage = this.showImage.bind(this);
    this.handleFollow = this.handleFollow.bind(this);
    this.goToFeed = this.goToFeed.bind(this);
  }

  doSubmit = () => {

  };


  componentDidMount(){

    if(localStorage.getItem("Username")){
        //window.location.href = "/feed";
      }
      else{
        window.location.href = "/";
      }

    console.log(this.props);
    let user = "some-user-0";
    try{
        if(this.props.match.params.id){
            user = this.props.match.params.id;
            //alert(user)
            //alert(user.indexOf("_"))
            
            if(user.indexOf("_")>0){
                user = user.split("");
                var i1 = user.indexOf("_");
                //alert(i1);
                user[i1] = "@";
                //alert(user);
                var i2 = user.lastIndexOf("_");
                //alert(i2);
                user[i2] = ".";
                user = user.join("");
                //alert(user);
                
            }
        }
        else{
            //GET FROM LS
            user = localStorage.getItem("Username");
        }
    }
    catch(e){
        user = "some-user-0";
        console.log(e);
    }

    var proxy = process.env.REACT_APP_PROXY_URL;
    var read_post = process.env.REACT_APP_POSTS_READ + user;

    
    let _this = this;
    window.jQuery.ajax({
        url: proxy + read_post,
        complete:function(data){
            _this.setState({
                "posts": data.responseJSON 
            });
            console.log(data);
        }
    });

    //Get Followers
    var get_followers = process.env.REACT_APP_GET_FOLLOWERS + (localStorage.getItem("Username")?localStorage.getItem("Username"):"vishumanvi");
    console.log(get_followers);
    window.jQuery.ajax({
        url: proxy + get_followers,
        complete:function(data){
            console.log(data);
            try{
            if(data.responseJSON){
                if(data.responseJSON.length==1){
                    if(Object.keys(data.responseJSON[0]).length==0){
                        _this.setState({
                            "followers": 0 ,
                            "followerData" : []
                        });
                    }
                    else{
                        _this.setState({
                            "followers": 1 ,
                            "followerData" : data.responseJSON
                        });
                    }
                }
                else{
                    _this.setState({
                        "followers": data.responseJSON.length,
                        "followerData" : data.responseJSON
                    });
                }                
            }
            }
            catch(e){

            }

     
        }
    });

    //Get Following
    var get_following = process.env.REACT_APP_GET_FOLLOWING + (localStorage.getItem("Username")?localStorage.getItem("Username"):"vishumanvi");
    console.log(get_following);
    window.jQuery.ajax({
        url: proxy + get_following,
        complete:function(data){
            console.log(data);            console.log(data);
            try{
            if(data.responseJSON){
                if(data.responseJSON.length==1){
                    if(Object.keys(data.responseJSON[0]).length==0){
                        _this.setState({
                            "following": 0 
                        });
                    }
                    else{
                        _this.setState({
                            "following": 1 
                        });
                    }
                }
                else{
                    _this.setState({
                        "following": data.responseJSON.length
                    });
                }                
            }
            }
            catch(e){

            }
            
        }
    });
    


    window.jQuery("body").append(`<div class=friendSuggestions><div class="friendlist instagradient">People You may know</div>    
        <a class=friendlist href="/profile/vish281_gmail_com"><img src=https://p7.hiclipart.com/preview/355/848/997/computer-icons-user-profile-google-account-photos-icon-account.jpg > Vish</a>
        <a class=friendlist href="/profile/arkil281_gmail_com"><img  src=https://p7.hiclipart.com/preview/355/848/997/computer-icons-user-profile-google-account-photos-icon-account.jpg> Arkil</a>
        <a class=friendlist href="/profile/saket281_gmail_com" ><img src=https://p7.hiclipart.com/preview/355/848/997/computer-icons-user-profile-google-account-photos-icon-account.jpg> Saket</a>
        <a class=friendlist href="/profile/vj281_gmail_com" ><img src=https://p7.hiclipart.com/preview/355/848/997/computer-icons-user-profile-google-account-photos-icon-account.jpg> Varun Jain</a>
        <a class=friendlist href="/profile/thanos_gmail_com" ><img src=https://p7.hiclipart.com/preview/355/848/997/computer-icons-user-profile-google-account-photos-icon-account.jpg> Varun Shrivastav</a></div>`);



  }

  goToFeed(){
    this.props.history.push({
        pathname: "/feed"
    })
  }


  openModal(){
    window.jQuery('#modal-toggle').toggleClass('active');
  }

  closeModal(){
    window.jQuery('#modal-toggle').toggleClass('active');
  }

  submitPost(e) {

        let _this = this;
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
                let x = process.env.REACT_APP_CLOUDFRONT_URL+"/"+d.key;
                _this.makePost(x);
        }). 
            catch(er=>console.log(er));
  }

  makePost(a){
      console.log(a);
      var proxy = process.env.REACT_APP_PROXY_URL;

      var write_post = process.env.REACT_APP_POST_WRITE + (localStorage.getItem("Username")?localStorage.getItem("Username"):"vishumanvi");
      
      let _this = this;
      window.jQuery.ajax({
          method: "POST",
          data : JSON.stringify({
            "image": a,
            "caption": document.querySelector("#caption").value
          }),
          url: proxy + write_post,
          complete:function(data){
                alert("Posted Successfully.");

                _this.sendNotifications();
              console.log(data);
          }
      });
  }

  sendNotifications(){


    const method = "POST"
    const headers = {
        "Content-type": "application/json",
        "Authorization": "Basic ODlkMmIyYWItYzZjNy00ZGU3LThiZjAtNGE1MTIwMGUwMTlh"
    }
    
    const body = JSON.stringify({
        "app_id" : "2041fdc7-a90d-45fe-984c-8986664cbd2e",
        "contents": {"en": localStorage.getItem("Username")+ " just uploaded an image!."} ,
        //"include_player_ids" : ["9589293b-a616-488f-9fa8-e793bbbe6441","6e0c6067-4492-4ccd-81d4-3181950e4550"]
        // "filters" : [
        // // {"field": "tag", "key": "cat", "relation": "=", "value": "1273812371283"} ,
        // // {"operator": "OR"}, {"field": "amount_spent", "relation": ">", "value": "0"}
        "included_segments" : ["Active Users", "Inactive Users"]

        //"filters":_tmp
                    
        // ]
    }) 
    
    //if(_tmp.length>0){
        const handleAsText = response => response.text()

        // const demo = document.getElementById("demo")
       fetch("https://onesignal.com/api/v1/notifications", {method, headers, body})
          .then(responseText => {
              console.log(responseText);
          });

        setTimeout(function(){
            window.location.reload();
        },2000);
 

  }


  showImage(url){
      images[0] = url;
      console.log(images);
      this.setState({
          "lightBox":true
      });
  }

  handleFollow(){


    let _this = this;
    var proxy = process.env.REACT_APP_PROXY_URL;

    var write_post = process.env.REACT_APP_FOLLOW_WRITE + (localStorage.getItem("Username")?localStorage.getItem("Username"):"vishumanvi");  ;
    
    let user = (_this.props.match ? _this.props.match.params?_this.props.match.params.id:"":"")
    if(user.indexOf("_")>0){
        user = user.split("");
        var i1 = user.indexOf("_");
        //alert(i1);
        user[i1] = "@";
        //alert(user);
        var i2 = user.lastIndexOf("_");
        //alert(i2);
        user[i2] = ".";
        user = user.join("");
        //alert(user);
        
    }

    console.log(user);

    window.jQuery.ajax({
        method: "POST",
        data : JSON.stringify({
          
          "UserId": user
        }),
        url: proxy + write_post,
        complete:function(data){
           
            console.log(data);
        }
    });

    //REACT_APP_FOLLOW_WRITE
  }


  render() {

    let photoIndex = 0;

    console.log(this.state);
    return (
      <div className="feeds-container container exts">
          <header>
              

<div class="container ">

    <div class="profile">

        <div class="profile-image">

            <img src="https://p7.hiclipart.com/preview/355/848/997/computer-icons-user-profile-google-account-photos-icon-account.jpg" alt="" />

        </div>

        <div class="profile-user-settings">

            <h1 class="profile-user-name">{this.props.match.params.id? this.props.match.params.id : localStorage.getItem("Firstname")+ " " + localStorage.getItem("Lastname")}</h1>

            {
                this.props.match.params.id ? 
                (<button class="btn profile-edit-btn" type="button" onClick={this.handleFollow}>Follow</button>):
                null
                
            }
            

            {/* <button class="btn profile-settings-btn" aria-label="profile settings"><i class="fas fa-cog" aria-hidden="true"></i></button> */}

        </div>

        <div class="profile-stats">

            <ul>
                <li><span class="profile-stat-count">{this.state.posts? this.state.posts.length : 0}</span> posts</li>
                <li><span class="profile-stat-count">{this.state.followers}</span> followers</li>
                <li><span class="profile-stat-count">{this.state.following}</span> following</li>
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
                        ? (<img src="https://wolper.com.au/wp-content/uploads/2017/10/image-placeholder.jpg" class="gallery-image" alt=""  onClick={()=>this.showImage("https://wolper.com.au/wp-content/uploads/2017/10/image-placeholder.jpg")} />)
                        : (
                            <React.Fragment>
                            <img src={number.Image}  class="gallery-image" alt="" onClick={()=>this.showImage(number.Image)}/>
                            <div class="gallery-item-info"  onClick={()=>this.showImage(number.Image)}>
        
                        <ul>
                            <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i>{number.Likes? number.Likes.length : 0}</li>
                            <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i> {number.Comments? number.Comments.length : 0}</li>
                        </ul>
        
                    </div>
                    </React.Fragment>
                          )
                    }


                    
        
                </div>
                )
            }) : (<img src="https://thumbs.gfycat.com/ConventionalOblongFairybluebird-max-1mb.gif" className="spinner"/>)
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



        {/* LightBox Code */}
        {this.state.lightBox && (
          <Lightbox
            mainSrc={images[photoIndex]}
            // nextSrc={images[(photoIndex + 1) % images.length]}
            // prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={() => this.setState({ lightBox: false })}
            // onMovePrevRequest={() =>
            //   this.setState({
            //     photoIndex: (photoIndex + images.length - 1) % images.length,
            //   })
            // }
            // onMoveNextRequest={() =>
            //   this.setState({
            //     photoIndex: (photoIndex + 1) % images.length,
            //   })
            // }
          />
        )}


        <div className="homebutton" onClick={this.goToFeed}>
            <img src="https://image.flaticon.com/icons/svg/20/20176.svg" width="100%"/>
        </div>




      </div>
    );
  }
}

export default Profile;
