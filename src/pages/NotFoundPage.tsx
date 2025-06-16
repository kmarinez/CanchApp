const NotFoundPage = () => {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        flexDirection: "column", 
        height: "100vh", 
        textAlign: "center" 
      }}>
        <h1 style={{ fontSize: "4rem", marginBottom: "1rem", color: "#2E8B57" }}>404</h1>
        <p style={{ fontSize: "1.2rem", color: "#555" }}>
          Lo sentimos, la página que buscas no existe.
        </p>
        <a href="/login" style={{ marginTop: "2rem", color: "#1E90FF", fontWeight: "bold", textDecoration: "none" }}>
          Volver al inicio
        </a>
      </div>
    );
  };
  
  export default NotFoundPage;
  