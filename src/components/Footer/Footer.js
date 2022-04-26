import './Footer.css';

// import { Link } from '../Link';

export const Footer = () => {
  return (
    <footer className="footer">
      <span className="footer__date">
        {`© ${new Date().getFullYear()} Kiruba Muthupalani.`}
      </span>
    </footer>
  );
};
