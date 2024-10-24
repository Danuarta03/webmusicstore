// src/app/admin/input/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image'; // Import Image from next/image

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

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async () => {
    if (!product.name || product.price <= 0 || product.stock < 0) {
      alert('Please provide valid product data.');
      return;
    }

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        alert('Product added successfully');
        fetchProducts(); // Refresh product list after adding a product
      } else {
        alert('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { // Fixed string interpolation
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Product deleted successfully');
        fetchProducts(); // Refresh product list after deleting a product
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product.');
    }
  };

  const handleUpdate = async (id: number) => {
    const updatedProduct = { ...product, id };
    try {
      const res = await fetch(`/api/admin/products`, { // Fixed string interpolation
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      if (res.ok) {
        alert('Product updated successfully');
        fetchProducts(); // Refresh product list after updating
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product.');
    }
  };

  return (
    <div className="add-product-page">
      <h1>Add Product</h1>
      <div className="add-product-form">
        <input type="text" placeholder="Name" onChange={(e) => setProduct({ ...product, name: e.target.value })} />
        <input type="text" placeholder="Description" onChange={(e) => setProduct({ ...product, description: e.target.value })} />
        <input type="number" placeholder="Price" onChange={(e) => setProduct({ ...product, price: +e.target.value })} />
        <input type="number" placeholder="Stock" onChange={(e) => setProduct({ ...product, stock: +e.target.value })} />
        <input type="text" placeholder="Image URL" onChange={(e) => setProduct({ ...product, image: e.target.value })} />
        <button onClick={handleSubmit}>Add Product</button>
      </div>

      {/* Display the list of products */}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
