import Logo from './Logo'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Logo height={88} />
          <p>
            A collective of Registered Social Workers offering counselling,
            clinical supervision, training, and consulting across Sudbury,
            Manitoulin, and Ontario.
          </p>
        </div>

        <div className="footer-col">
          <h5>Explore</h5>
          <ul className="footer-links">
            <li><a href="#about">About</a></li>
            <li><a href="#specializations">Approach</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#team">Our Team</a></li>
            <li><a href="#programs">Programs</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Services</h5>
          <ul className="footer-links">
            <li><a href="#services">Individual Therapy</a></li>
            <li><a href="#services">Couples &amp; Family</a></li>
            <li><a href="#services">Clinical Supervision</a></li>
            <li><a href="#services">Consulting</a></li>
            <li><a href="#services">Training &amp; Workshops</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Contact</h5>
          <ul className="footer-links">
            <li><a href="tel:+17052075300">(705) 207-5300</a></li>
            <li>
              <a
                href="https://activemindstherapyconsulting.janeapp.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Online
              </a>
            </li>
            <li>Sudbury &amp; Manitoulin, ON</li>
            <li>510 Perivale Rd E, Spring Bay</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {year} ACTive Minds Therapy &amp; Consulting. All rights reserved.</span>
        <span>Crafted with care for the communities we serve.</span>
      </div>
    </footer>
  )
}
