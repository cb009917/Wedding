import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  const weddingDate = 'June 15, 2024';

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-names">
          <h3>Anna & James</h3>
        </div>

        <div className="footer-date">
          <p>{weddingDate}</p>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-credits">
          <p>Made with ❤️ for our special day</p>
          <p className="footer-copyright">
            &copy; {currentYear} All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
