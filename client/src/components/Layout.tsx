/**
 * Layout Component
 * Wraps every page with the DreamCap Financial Header (logo) and Footer (compliance disclaimers).
 * The header floats on top of the page content with a semi-transparent background.
 */

import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
