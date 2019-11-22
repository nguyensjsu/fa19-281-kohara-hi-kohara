import React, {useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';

function App() {

    const [data, setData] = useState([]);

    let navbarStyles = {
        backgroundColor: window.REACT_APP_NAVBAR_COLOR
    }

    useEffect(() => {
        const fetchData = async () => {

            const result = await axios(
                window.REACT_APP_API_URL,
            );
            setData(result.data);
        };
        fetchData();
    }, []);


    return (

        <div>
            <image src="https://i.imgur.com/C7jbKhd.png"></image>
        </div>
    );
}

export default App;
