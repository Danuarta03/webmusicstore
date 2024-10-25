"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image'; 

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

export default function AddProduct() {
  const [product, setProduct] = useState({ name: '', description: '', price: 0, stock: 0, image: '' });
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products from the database when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);
      const data = await res.json();
      console.log('Fetched products:', data);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Error fetching products. Please try again later.');
    }
  };

  // Function to handle input change
  const handleInputChange = (field: keyof typeof product, value: string | number) => {
    setProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Validate product data before submitting
  const validateProduct = () => {
    const { name, price, stock } = product;
    if (!name.trim() || price <= 0 || stock < 0) {
      alert('Please provide valid product data.');
      return false;
    }
    return true;
  };

  // Handle product submission
  const handleSubmit = async () => {
    if (!validateProduct()) return;

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      if (res.ok) {
        alert('Product added successfully');
        fetchProducts(); // Refresh product list
      } else {
        const errorData = await res.json();
        console.error('Failed to add product:', errorData);
        alert('Failed to add product: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product.');
    }
  };

  // Handle product deletion
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Product deleted successfully');
        fetchProducts(); // Refresh product list
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product.');
    }
  };

  // Handle product update
  const handleUpdate = async (id: number) => {
    const updatedProduct = { ...product, id };
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });

      if (res.ok) {
        alert('Product updated successfully');
        fetchProducts(); // Refresh product list
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product.');
    }
  };

  // Component to render product row
  const ProductRow = ({ product }: { product: Product }) => (
    <tr key={product.id}>
      <td>{product.name}</td>
      <td>{product.description}</td>
      <td>${product.price}</td>
      <td>{product.stock}</td>
      <td>
        <Image
          src={product.image}
          alt={product.name}
          width={100}
          height={100}
          layout="fixed"
        />
      </td>
      <td>
        <button onClick={() => handleUpdate(product.id)}>Update</button>
        <button onClick={() => handleDelete(product.id)}>Delete</button>
      </td>
    </tr>
  );

  return (
    <div className="add-product-page">
      <h1>Add Product</h1>
      <div className="add-product-form">
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          onChange={(e) => handleInputChange('price', +e.target.value)}
        />
        <input
          type="number"
          placeholder="Stock"
          onChange={(e) => handleInputChange('stock', +e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          onChange={(e) => handleInputChange('image', e.target.value)}
        />
        <button onClick={handleSubmit}>Add Product</button>
      </div>

      <div className="product-list">
        <h2>Product List</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
