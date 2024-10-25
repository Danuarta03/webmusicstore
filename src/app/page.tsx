"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

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
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        alert('Failed to fetch products.');
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = async () => {
    try {
      const res = await fetch(`/api/products?search=${search}`);
      const data = await res.json();
      console.log(data);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products.');
    }
  };

  const toggleDescription = (id: number) => {
    setExpandedProduct(expandedProduct === id ? null : id);
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
              height={300}
              layout="responsive"
              style={{ borderRadius: '8px' }}
            />
            <h2>{product.name}</h2>
            <p className={`description ${expandedProduct === product.id ? 'expanded' : ''}`}>
              {product.description}
            </p>
            <p>${product.price}</p>
            <p>Stock: {product.stock}</p>
            <button onClick={() => toggleDescription(product.id)}>
              {expandedProduct === product.id ? 'Hide Details' : 'See Details'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
