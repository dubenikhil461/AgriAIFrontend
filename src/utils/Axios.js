import axios from "axios";


const Ax = axios.create({
    baseURL : "https://agriaibackend1.onrender.com/api",
    withCredentials :true
})

export default Ax
