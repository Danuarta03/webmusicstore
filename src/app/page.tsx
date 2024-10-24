// src/app/page.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image'; // Import Image from next/image

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

export default function Storefront() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  const handleSearch = async () => {
    try {
      const res = await fetch(`/api/products?search=${search}`); // Fixed string interpolation
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products.');
    }
  };

  return (
    <div className="storefront">
      <h1 className="store-title">Music Store</h1>
      <div className="search-section">
        <input 
          type="text" 
          placeholder="Search for music" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <hr className="separator-line" />
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <Image
              src={product.image}
              alt={product.name}
              width={500}
              height={500}
              layout="responsive" // Pastikan gambar responsif
            />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <p>Stock: {product.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
