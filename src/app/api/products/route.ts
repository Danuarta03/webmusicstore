// src/app/api/products/route.ts
import { db } from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Error fetching products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const product = await req.json();
    const { name, description, price, stock, image } = product;

    await db.query(
      'INSERT INTO products (name, description, price, stock, image) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, stock, image]
    );

    return NextResponse.json({ message: 'Product added' }, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ message: 'Error adding product' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  try {
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Product deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ message: 'Error deleting product' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const product = await req.json();
    const { id, name, description, price, stock, image } = product;

    await db.query(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image = ? WHERE id = ?',
      [name, description, price, stock, image, id]
    );

    return NextResponse.json({ message: 'Product updated' }, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ message: 'Error updating product' }, { status: 500 });
  }
}
