// src/components/ProductList.js
import React, { useEffect, useState } from "react";
import { fetchProducts } from "./api";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import _debounce from "lodash/debounce";


const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null)

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const getProducts = async () => {
      try {
       setLoading(true);
       const data = await fetchProducts();
       setProducts(data);
       setFilteredProducts(data); 
       setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    getProducts();
  }, []);


  useEffect(()=>{
    const debounceSearch=_debounce((value)=>{
      const filteredData = products.filter((product) =>
        product.title.toLowerCase().includes(value.toLowerCase())
      );
        setFilteredProducts(filteredData);
    },300)
    debounceSearch(searchTerm);
    return ()=>{
      debounceSearch.cancel();
    }
  },[searchTerm,products]);




    const handleSnackbarClose = () => {
      setError(null);
    };

  return (
    <Container
      style={{
        padding: theme.spacing(2),
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Store Products
      </Typography>
      <TextField
        label="Search Products"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: theme.spacing(2) }}
      />
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </div>
      ) : error ? (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity="error">
            {error}
          </Alert>
        </Snackbar>
      ) : (
        <TableContainer
          component={Paper}
          style={{
            marginTop: theme.spacing(2),
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "8px",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                {!isSmallScreen && <TableCell>Description</TableCell>}
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell style={{ padding: theme.spacing(1) }}>
                    <img
                      src={product.image}
                      alt={product.title}
                      style={{
                        width: isSmallScreen ? 30 : 50,
                        height: isSmallScreen ? 30 : 50,
                      }}
                    />
                  </TableCell>
                  <TableCell style={{ padding: theme.spacing(1) }}>
                    {product.title}
                  </TableCell>
                  {!isSmallScreen && (
                    <TableCell>{product.description}</TableCell>
                  )}
                  <TableCell style={{ padding: theme.spacing(1) }}>
                    ${product.price}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ProductList;
