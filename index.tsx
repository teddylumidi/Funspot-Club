import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// --- SVG Icons ---
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" /></svg>;
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962c.566-.16-1.168.356-1.168.356m3.633.82-1.168-.356m1.168.356c-.566.16-1.533-.205-1.533-.205m2.7 2.062a5.987 5.987 0 0 1-1.533-.205m1.533.205a5.987 5.987 0 0 0-1.533.205m-2.7-2.062a5.987 5.987 0 0 0-1.533.205m1.533-.205L8.25 15.75M12 12a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21v-1.5a2.25 2.25 0 0 1 2.25-2.25h12a2.25 2.25 0 0 1 2.25 2.25v1.5" /></svg>;
const CheckBadgeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>;
const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.062-.163-2.09-.465-3.065A12.015 12.015 0 0 0 17.618 5.984Z" /></svg>;
const RocketLaunchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.82m5.84-2.56a12.028 12.028 0 0 0-5.84 7.38m0-7.38c-3.15.52-5.84-1.28-5.84-4.28 0-1.92.93-3.66 2.34-4.72a9.01 9.01 0 0 1 4.72-2.34c2.99 0 4.8 2.69 4.28 5.84a6.003 6.003 0 0 1-7.38 5.84Z" /></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6.75Z" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const WhatsAppIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M16.6 14c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.7-.8.9-.1.1-.3.2-.5.1-.3-.1-.9-.3-1.8-.9-.7-.5-1.1-1-1.3-1.5-.1-.2 0-.4.1-.5l.5-.5c.1 0 .2-.1.3-.2l.2-.3c.1-.1.1-.3 0-.4-.1-.1-.6-1.5-.8-2-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9 0 1.2.8 2.2 1 2.4.1.2 1.5 2.3 3.6 3.2.5.2 1 .3 1.3.4.5.1 1-.1 1.2-.2.3-.2.6-.8.8-1 .1-.2.1-.4 0-.5l-.3-.1zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/></svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h-2v-2h2V7a2 2 0 0 1 2-2h2v2h-2v2h2v2h-2v6z"/></svg>;
const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 14c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5zm3-5c0 1.66-1.34 3-3 3s-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3z"/></svg>;

// --- Mock Data ---
const programs = [
  {
    title: 'Summer Weekly Program',
    days: 'Mon, Wed & Fri',
    time: '3:30PM - 6:00PM',
    icon: CalendarIcon,
    price: 'KES 8,000/month',
  },
  {
    title: 'Weekend Sessions',
    days: 'Sat & Sun',
    time: '3:30PM - 6:00PM',
    icon: UserGroupIcon,
    price: 'KES 6,000/month',
  },
];

const skills = [
  {
    title: 'Personal Training',
    description: 'One-on-one coaching to accelerate your learning and master specific techniques.',
    icon: CheckBadgeIcon,
  },
  {
    title: 'Fundamental Skating Skills',
    description: 'Learn the basics from the ground up, including balance, posture, and forward motion.',
    icon: RocketLaunchIcon,
  },
  {
    title: 'Learn how to Glide',
    description: 'Develop smooth and effortless gliding techniques for a more graceful skating experience.',
    icon: RocketLaunchIcon,
  },
  {
    title: 'Stopping Practice',
    description: 'Master various stopping methods to ensure your safety and build confidence on wheels.',
    icon: ShieldCheckIcon,
  },
];

// --- Components ---

const Header = ({ onBookNowClick }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <nav className="nav">
          <a href="#" className="logo">
            <span className="funpot">funpot </span>
            <span className="skating">SKATING</span>
          </a>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#programs">Programs</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <button onClick={onBookNowClick} className="btn btn-primary">Book Now</button>
        </nav>
      </div>
    </header>
  );
};

const Hero = ({ onBookNowClick }) => (
  <section id="home" className="hero">
    <div className="container">
      <h1 className="learn-text">Learn</h1>
      <h2 className="skating-text">SKATING</h2>
      <p>CONQUER YOUR FEAR, GAIN THE EXPERIENCE</p>
      <button onClick={onBookNowClick} className="btn btn-primary">Book a Session</button>
    </div>
  </section>
);

const Programs = ({ onBookNowClick }) => (
  <section id="programs" className="section">
    <div className="container">
      <div className="section-title">
        <h2>Our Programs</h2>
        <p>Choose the perfect schedule to kickstart your skating journey with our expert coaches.</p>
      </div>
      <div className="program-cards">
        {programs.map((program) => {
          const Icon = program.icon;
          return (
            <div key={program.title} className="program-card">
              <div className="icon"><Icon /></div>
              <h3>{program.title}</h3>
              <p className="days">{program.days}</p>
              <p className="time">{program.time}</p>
              <button onClick={onBookNowClick} className="btn btn-secondary">Join Program</button>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const Skills = () => (
  <section id="about" className="section section-dark">
    <div className="container">
      <div className="section-title">
        <h2>Become Stronger</h2>
        <p>Our curriculum is designed to build your confidence and skills from beginner to pro.</p>
      </div>
      <div className="skills-list">
        {skills.map((skill) => {
          const Icon = skill.icon;
          return (
            <div key={skill.title} className="skill-item">
              <div className="icon"><Icon /></div>
              <div>
                <h3>{skill.title}</h3>
                <p>{skill.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const Location = () => (
  <section id="contact" className="section">
    <div className="container">
      <div className="section-title">
        <h2>Find Us & Get In Touch</h2>
        <p>We're located at the beautiful Buntwani Waterfront. Come say hi or give us a call!</p>
      </div>
      <div className="location-content">
        <div className="location-map">
          {/* In a real app, this would be an interactive map */}
          <img src="https://images.unsplash.com/photo-1561331822-241b1198e329?q=80&w=2070&auto=format&fit=crop" alt="Map of Buntwani Waterfront, Malindi"/>
        </div>
        <div className="location-details">
          <h3>Our Home Rink</h3>
          <div className="contact-item">
            <div className="icon"><MapPinIcon /></div>
            <div className="details">
              <span>Location</span>
              <p>Buntwani Waterfront, Malindi</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="icon"><PhoneIcon /></div>
            <div className="details">
              <span>Call or WhatsApp</span>
              <p><a href="tel:+254780941396">+254 780 941 396</a></p>
              <p><a href="tel:+254713715158">+254 713 715 158</a></p>
            </div>
          </div>
          <div className="contact-item">
            <div className="icon"><CalendarIcon /></div>
            <div className="details">
              <span>Open Hours</span>
              <p>Mon, Wed, Fri, Sat & Sun: 3:30PM - 6:00PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Equipment = () => (
  <section className="equipment-banner">
    <div className="container">
      <p>All Skating Equipment is Available for Sale at The Club!</p>
    </div>
  </section>
);

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div>
            <h3>Ready to Roll?</h3>
            <p className="footer-subtitle">Join the Funport Skating Club today!</p>
          </div>
          <div className="footer-right-column">
            <div className="footer-contacts">
               <a href="tel:+254780941396">+254 780 941 396</a>
               <a href="mailto:hello@funportskating.com">hello@funportskating.com</a>
            </div>
            <div className="social-links">
              <a href="#" aria-label="WhatsApp"><WhatsAppIcon /></a>
              <a href="#" aria-label="Facebook"><FacebookIcon /></a>
              <a href="#" aria-label="Instagram"><InstagramIcon /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Funport Skating Club. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const BookingModal = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const modalContentRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    // Reset state after transition
    setTimeout(() => setSubmitted(false), 300);
  }

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
        handleClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);


  return (
    <div className={`modal-overlay ${isOpen ? 'show' : ''}`}>
      <div className="modal-content" ref={modalContentRef}>
        {!submitted ? (
          <>
            <div className="modal-header">
              <h2>Book Your Session</h2>
              <button onClick={handleClose} className="close-btn" aria-label="Close"><CloseIcon /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" required />
              </div>
              <div className="form-group">
                <label htmlFor="program">Choose a Program</label>
                <select id="program" required>
                  <option value="">Select a program...</option>
                  <option value="weekly">Summer Weekly Program</option>
                  <option value="weekend">Weekend Sessions</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Submit Booking</button>
              </div>
            </form>
          </>
        ) : (
          <div className="confirmation-message">
            <div className="icon"><CheckCircleIcon/></div>
            <h3>Thank You!</h3>
            <p>Your booking request has been received. We will contact you shortly to confirm the details.</p>
            <button onClick={handleClose} className="btn btn-primary">Done</button>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    useEffect(() => {
      document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
    }, [isModalOpen]);

    return (
        <>
            <Header onBookNowClick={() => setIsModalOpen(true)} />
            <main>
                <Hero onBookNowClick={() => setIsModalOpen(true)} />
                <Programs onBookNowClick={() => setIsModalOpen(true)} />
                <Skills />
                <Location />
                <Equipment />
            </main>
            <Footer />
            <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);