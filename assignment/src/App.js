import { Container, Typography } from '@mui/material';
import './App.css';
import ProductList from './ProductList';

function App() {
  return (
    <Container>
      <Typography variant='h2' align='center' gutterBottom>
        Store
      </Typography>
      <ProductList/>
    </Container>
  );
}

export default App;
