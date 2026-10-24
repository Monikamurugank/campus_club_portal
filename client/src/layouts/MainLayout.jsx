import Navbar from './Navbar';

const MainLayout = ({ children }) => (
  <>
    <Navbar />
    <main style={{ minHeight: '90vh', background: '#f8f5f0' }}>
      {children}
    </main>
    <footer className="text-center py-3" style={{ background: '#1a3c2e', color: '#ccc', fontSize: '0.85rem' }}>
      © {new Date().getFullYear()} Campus Club Management Portal
    </footer>
  </>
);

export default MainLayout;
