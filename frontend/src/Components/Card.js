// components/CardComponent.js
const Card = ({ title, buttonText, children }) => {
    return (
      <div className="card">
        <header className="card-header">
          <h2>{title}</h2>
          <button>{buttonText}</button>
        </header>
        <div className="card-content">
          {children}
        </div>
      </div>
    );
  };
  
  export default Card;
  