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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
// styling and  making responsive
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    // Fetch products from the API when the component mounts
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        // Set error state if fetching data fails
        setError(error.message);
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  useEffect(() => {
    // Debounce the search functionality to improve performance
    const debounceSearch = _debounce((value) => {
      const filteredData = products.filter((product) =>
        product.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filteredData);
    }, 300);
    debounceSearch(searchTerm);
    // Cleanup function to cancel debounce timer
    return () => {
      debounceSearch.cancel();
    };
  }, [searchTerm, products]);

  const handleSnackbarClose = () => {
    setError(null);
  };

  return (
    <Container
      style={{
        padding: theme.spacing(2),
        fontFamily: "serif",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        style={{
          marginBottom: theme.spacing(2),
          fontWeight: 700,
          fontSize: "2rem",
        }}
      >
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
        // Display CircularProgress while loading
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
        //Display the fetched data in a table using Material-UI Components
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
                <TableCell style={{ fontWeight: "700" }}>Image</TableCell>
                <TableCell style={{ fontWeight: "700" }}>Title</TableCell>
                {!isSmallScreen && (
                  <TableCell style={{ fontWeight: "700" }}>
                    Description
                  </TableCell>
                )}
                <TableCell style={{ fontWeight: "700" }}>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell
                    style={{
                      padding: theme.spacing(1),
                    }}
                  >
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
                    <TableCell
                      style={{
                        padding: theme.spacing(1),
                        fontSize: "0.9rem",
                      }}
                    >
                      {product.description}
                    </TableCell>
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
