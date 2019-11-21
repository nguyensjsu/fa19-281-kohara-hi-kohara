import React, {Component} from "react";
import axios from "axios";
import { Redirect } from "react-router";
import './styles/Profile.css';


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
  }

  doSubmit = () => {

  };


  componentDidMount(){

    var read_post = process.env.REACT_APP_POSTS_READ;
    console.log(read_post);
    var proxy = 'https://cors-anywhere.herokuapp.com/';
    //Incase you want to use this.setState after API call use _this and not this.
    let _this = {};
    window.jQuery.ajax({
        url: proxy + read_post,
        complete:function(data){
            console.log(data);
        }
    });
  }


  render() {
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

            <button class="btn profile-edit-btn">Edit Profile</button>

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

        <div class="gallery-item" tabindex="0">

            <img src="https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?w=500&h=500&fit=crop" class="gallery-image" alt=""/>

            <div class="gallery-item-info">

                <ul>
                    <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i> 56</li>
                    <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i> 2</li>
                </ul>

            </div>

        </div>

        <div class="gallery-item" tabindex="0">

            <img src="https://images.unsplash.com/photo-1497445462247-4330a224fdb1?w=500&h=500&fit=crop" class="gallery-image" alt="" />

            <div class="gallery-item-info">

                <ul>
                    <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="far fa-heart" aria-hidden="true"></i> 89</li>
                    <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i> 5</li>
                </ul>

            </div>

        </div>

        <div class="gallery-item" tabindex="0">

            <img src="https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=500&h=500&fit=crop" class="gallery-image" alt="" />

            <div class="gallery-item-type">

                <span class="visually-hidden">Gallery</span><i class="fas fa-clone" aria-hidden="true"></i>

            </div>

            <div class="gallery-item-info">

                <ul>
                    <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i> 42</li>
                    <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i> 1</li>
                </ul>

            </div>

        </div>

        <div class="gallery-item" tabindex="0">

            <img src="https://images.unsplash.com/photo-1502630859934-b3b41d18206c?w=500&h=500&fit=crop" class="gallery-image" alt="" />

            <div class="gallery-item-type">

                <span class="visually-hidden">Video</span><i class="fas fa-video" aria-hidden="true"></i>

            </div>

            <div class="gallery-item-info">

                <ul>
                    <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i> 38</li>
                    <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i> 0</li>
                </ul>

            </div>

        </div>

        <div class="gallery-item" tabindex="0">

            <img src="https://images.unsplash.com/photo-1498471731312-b6d2b8280c61?w=500&h=500&fit=crop" class="gallery-image" alt="" />

            <div class="gallery-item-type">

                <span class="visually-hidden">Gallery</span><i class="fas fa-clone" aria-hidden="true"></i>

            </div>

            <div class="gallery-item-info">

                <ul>
                    <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i> 47</li>
                    <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i> 1</li>
                </ul>

            </div>

        </div>

        <div class="gallery-item" tabindex="0">

            <img src="https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=500&h=500&fit=crop" class="gallery-image" alt="" />

            <div class="gallery-item-info">

                <ul>
                    <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i> 94</li>
                    <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i> 3</li>
                </ul>

            </div>

        </div>

        <div class="gallery-item" tabindex="0">

            <img src="https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=500&h=500&fit=crop" class="gallery-image" alt="" />

            <div class="gallery-item-type">

                <span class="visually-hidden">Gallery</span><i class="fas fa-clone" aria-hidden="true"></i>

            </div>

            <div class="gallery-item-info">

                <ul>
                    <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i> 52</li>
                    <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i> 4</li>
                </ul>

            </div>

        </div>

        <div class="gallery-item" tabindex="0">

            <img src="https://images.unsplash.com/photo-1515814472071-4d632dbc5d4a?w=500&h=500&fit=crop" class="gallery-image" alt="" />

            <div class="gallery-item-info">

                <ul>
                    <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i> 66</li>
                    <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i> 2</li>
                </ul>

            </div>

        </div>

        <div class="gallery-item" tabindex="0">

            <img src="https://images.unsplash.com/photo-1511407397940-d57f68e81203?w=500&h=500&fit=crop" class="gallery-image" alt="" />

            <div class="gallery-item-type">

                <span class="visually-hidden">Gallery</span><i class="fas fa-clone" aria-hidden="true"></i>

            </div>

            <div class="gallery-item-info">

                <ul>
                    <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i> 45</li>
                    <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i> 0</li>
                </ul>

            </div>

        </div>

        <div class="gallery-item" tabindex="0">

            <img src="https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?w=500&h=500&fit=crop" class="gallery-image" alt="" />

            <div class="gallery-item-info">

                <ul>
                    <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i> 34</li>
                    <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i> 1</li>
                </ul>

            </div>

        </div>

        <div class="gallery-item" tabindex="0">

            <img src="https://images.unsplash.com/photo-1505058707965-09a4469a87e4?w=500&h=500&fit=crop" class="gallery-image" alt=""/>

            <div class="gallery-item-info">

                <ul>
                    <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i> 41</li>
                    <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i> 0</li>
                </ul>

            </div>

        </div>

        <div class="gallery-item" tabindex="0">

            <img src="https://images.unsplash.com/photo-1423012373122-fff0a5d28cc9?w=500&h=500&fit=crop" class="gallery-image" alt=""/>

            <div class="gallery-item-type">

                <span class="visually-hidden">Video</span><i class="fas fa-video" aria-hidden="true"></i>

            </div>

            <div class="gallery-item-info">

                <ul>
                    <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i> 30</li>
                    <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i> 2</li>
                </ul>

            </div>

        </div>

    </div>


   

</div>


</main>
       

    <button className="upload-image instagradient">+</button>
      </div>
    );
  }
}

export default Profile;
