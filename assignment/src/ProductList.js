import React, { useEffect, useState } from 'react'
import { fetchProducts } from './api'
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography} from "@mui/material";

const ProductList = () => {
    const [products,setProducts]=useState([]);
    const [filteredproducts,setFilteredProducts]=useState([]);
    const [serachQuery,setSearchQuery]=useState("")
    useEffect(()=>{
        const getProducts=async()=>{
            const data= await fetchProducts();
            console.log(data); 
            setProducts(data);
        }
        getProducts();
    },[]);

    useEffect(()=>{
        setFilteredProducts(
            products.filter(product=>
                product.title.toLowerCase().includes(serachQuery.toLowerCase())
            )
        )
    },[serachQuery,products])
  

  return (
    <Container>
      <TextField
        label="Search Products"
        variant="outlined"
        fullWidth
        value={serachQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableCell>Image</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Price</TableCell>
          </TableHead>
          <TableBody>
            {filteredproducts.map((product) => (
              <TableRow>
                <TableCell>
                  <img src={product.image} alt={product.title} style={{width:100,height:100}}/>
                </TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default ProductList