import { db } from '../../../../lib/db'; // Import koneksi database
import { NextResponse } from 'next/server';
import { ResultSetHeader, RowDataPacket } from 'mysql2'; // Import tipe data

// Helper function untuk log error dengan konsisten
const logError = (message: string, error: unknown) => {
  console.error(`${message}:`, error);
};

/** 
 * GET: Fetch semua produk 
 */
export async function GET() {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM products');
    console.log('Fetched products:', rows);
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    logError('Error fetching products', error);
    return NextResponse.json({ message: 'Error fetching products' }, { status: 500 });
  }
}

/**
 * POST: Tambahkan produk baru 
 */
export async function POST(req: Request) {
  try {
    const product = await req.json();
    console.log('Received product data:', product);

    // Destructuring dan validasi
    const { name, description, price, stock, image } = product;
    if (!name || price <= 0 || stock < 0) {
      throw new Error('Invalid product data. Ensure all fields are filled correctly.');
    }

    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO products (name, description, price, stock, image) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, stock, image]
    );

    console.log('Product added successfully with ID:', result.insertId);
    return NextResponse.json({ message: 'Product added', productId: result.insertId }, { status: 201 });
  } catch (error) {
    logError('Error adding product', error);
    return NextResponse.json({ message: 'Error adding product' }, { status: 500 });
  }
}

/**
 * DELETE: Hapus produk berdasarkan ID
 */
export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
  }

  try {
    const [result] = await db.query<ResultSetHeader>('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    console.log('Product deleted successfully:', id);
    return NextResponse.json({ message: 'Product deleted' }, { status: 200 });
  } catch (error) {
    logError('Error deleting product', error);
    return NextResponse.json({ message: 'Error deleting product' }, { status: 500 });
  }
}

/**
 * PUT: Update detail produk berdasarkan ID
 */
export async function PUT(req: Request) {
  try {
    const product = await req.json();
    console.log('Received update request:', product);

    const { id, name, description, price, stock, image } = product;

    if (!id || !name || price <= 0 || stock < 0) {
      throw new Error('Invalid product data. Ensure all fields are filled correctly.');
    }

    const [result] = await db.query<ResultSetHeader>(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image = ? WHERE id = ?',
      [name, description, price, stock, image, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    console.log('Product updated successfully:', id);
    return NextResponse.json({ message: 'Product updated' }, { status: 200 });
  } catch (error) {
    logError('Error updating product', error);
    return NextResponse.json({ message: 'Error updating product' }, { status: 500 });
  }
}
