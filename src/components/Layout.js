export const Layout = ({ children }) => {
    return (
      <main className="max-w-7xl mx-auto py-6 px-6 relative">
      <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg p-6">
        {children}
      </div>
    </main>
    );
  };
  export default Layout;