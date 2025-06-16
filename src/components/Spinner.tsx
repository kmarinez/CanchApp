function Spinner({ small = false }) {
    return (
      <div className={`spinner ${small ? "spinner-sm" : ""}`}></div>
    );
  }
  
  export default Spinner;