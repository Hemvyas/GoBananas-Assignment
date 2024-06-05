import axios from "axios"

//fetching data from api
export const fetchProducts=async()=>{
    const res = await axios.get("https://fakestoreapi.com/products");
    console.log(res.data);   
    return res.data;
}