import React from 'react';
import { Card } from 'react-bootstrap';
import Rating from './Rating';
import { Link } from 'react-router-dom';

function Product({ product }) {
  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`/product/${product._id}`}>
        <Card.Img
          src={product.image}
          style={{ height: '200px' }}
          className='product-image'
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as='div'>
          <div className='my-3'>
            <strong>${product.price}</strong>
          </div>
        </Card.Text>
        <Card.Text as='div'>
          <div className='my-3'>
          <Rating 
          rating={product.rating}
          
           />      {product.numReviews} reviews 


          </div>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Product;
