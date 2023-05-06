// ✨ implement axiosWithAuth
import axios from "axios";

function axiosWithAuth (){
    const token = localStorage.getItem("token")
    return axios.create({
        baseURL: 'http://localhoast:9000/api/',
        headers: {Authorization: token}
    })
}


export default axiosWithAuth