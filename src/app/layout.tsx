// app/layout.tsx
import Link from 'next/link';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <ul>
              <li>
                <Link href="/">Etalase</Link> {/* Storefront */}
              </li>
              <li>
                <Link href="/admin/input">Management Product</Link> {/* Product Management */}
              </li>
            </ul>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
