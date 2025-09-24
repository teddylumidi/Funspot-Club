import React, { ReactNode } from 'react';

// Reusable click handler for placeholder functionality
const handleComingSoon = (e: React.MouseEvent<HTMLAnchorElement>, message: string) => {
    e.preventDefault();
    alert(message);
};

const Header: React.FC = () => {
    const navLinks = [
        { name: 'HOME', href: '#home' },
        { name: 'ABOUT', href: '#about' },
        { name: 'EVENTS', href: '#events' },
        { name: 'LESSONS', href: '#lessons' },
        { name: 'GALLERY', href: '#gallery' }
    ];

    return (
        <header className="absolute top-0 left-0 right-0 z-10">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-24">
                <div className="text-3xl font-['Bebas_Neue'] text-[#A94438] tracking-wider">
                    <a href="#home">FUNSPOT</a>
                </div>
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map(link => (
                        <a key={link.name} href={link.href} className="text-sm font-medium tracking-wider text-gray-600 hover:text-[#A94438] transition-colors">{link.name}</a>
                    ))}
                </div>
                <a href="#" onClick={(e) => handleComingSoon(e, 'Registration form coming soon!')} className="hidden md:inline-block bg-[#A94438] text-white px-6 py-2 text-sm font-bold tracking-wider hover:bg-[#933a2f] transition-colors">
                    JOIN NOW
                </a>
                <div className="md:hidden">
                    {/* Mobile menu button can be added here */}
                </div>
            </nav>
        </header>
    );
};

const Hero: React.FC = () => {
    return (
        <section id="home" className="pt-24 min-h-[80vh] flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
                <div className="text-left">
                    <h1 className="text-7xl lg:text-8xl font-['Bebas_Neue'] text-[#A94438] leading-none tracking-wide">
                        SKATE WITH CONFIDENCE
                    </h1>
                    <a href="#" onClick={(e) => handleComingSoon(e, 'Registration form coming soon!')} className="mt-8 inline-block bg-[#A94438] text-white px-10 py-4 text-lg font-bold tracking-wider hover:bg-[#933a2f] transition-colors">
                        JOIN NOW
                    </a>
                </div>
                <div className="flex justify-center">
                    <img src="https://picsum.photos/seed/skaterepair/600/700" alt="Person maintaining rollerblades" className="w-full h-auto max-w-md object-cover" />
                </div>
            </div>
        </section>
    );
};

const JoinClub: React.FC = () => {
    return (
        <section id="about" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
                <div className="flex justify-center">
                    <img src="https://picsum.photos/seed/skategear/500/600" alt="Skating helmet and knee pads" className="w-full h-auto max-w-md object-cover" />
                </div>
                <div>
                    <h2 className="text-5xl font-['Bebas_Neue'] text-[#A94438] tracking-wider">
                        JOIN OUR SKATE CLUB
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-lg">
                        Our skating club welcomes skaters of every age and skill level. Whether you're just starting out or are a seasoned pro, you'll find a supportive community here. Come improve your skills, make new friends, and share your love of skating in a safe and inclusive space.
                    </p>
                    <a href="#events" className="mt-8 inline-block bg-[#A94438] text-white px-8 py-3 text-sm font-bold tracking-wider hover:bg-[#933a2f] transition-colors">
                        UPCOMING EVENTS
                    </a>
                </div>
            </div>
        </section>
    );
};

const Events: React.FC = () => {
    const eventList = [
        {
            title: 'SKATE NIGHT',
            description: 'Join us for a fun evening of skating and socializing under the disco lights. All levels welcome!',
            imgSrc: 'https://picsum.photos/seed/skatenight/600/400',
            date: 'FRIDAY, OCT 25, 2024',
            time: '7:00 PM - 10:00 PM',
            location: 'Funspot Main Rink'
        },
        {
            title: 'BEGINNER SKILLS WORKSHOP',
            description: 'Learn the basics of skating in a friendly environment. Perfect for newcomers and those looking to improve.',
            imgSrc: 'https://picsum.photos/seed/skateworkshop/600/400',
            date: 'SATURDAY, NOV 2, 2024',
            time: '10:00 AM - 12:00 PM',
            location: 'Funspot Training Area'
        },
        {
            title: 'HALLOWEEN SKATE PARTY',
            description: 'Get your costumes ready! Join us for a spooky skate session with music, games, and a costume contest.',
            imgSrc: 'https://picsum.photos/seed/skatehalloween/600/400',
            date: 'THURSDAY, OCT 31, 2024',
            time: '6:00 PM - 9:00 PM',
            location: 'Funspot Main Rink'
        }
    ];

    return (
        <section id="events" className="bg-[#A94438] py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
                <h2 className="text-5xl font-['Bebas_Neue'] tracking-wider mb-16 text-center">
                    EVENTS
                </h2>
                <div className="space-y-16">
                    {eventList.map((event, index) => (
                        <div key={event.title} className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                            <div className="md:w-1/2">
                                <img src={event.imgSrc} alt={event.title} className="w-full h-80 object-cover" />
                            </div>
                            <div className="md:w-1/2">
                                <span className="text-sm font-bold tracking-widest text-white/80">{event.date}</span>
                                <h3 className="mt-2 text-3xl font-['Bebas_Neue'] tracking-wider">{event.title}</h3>
                                <div className="flex items-center space-x-3 text-white/90 mt-2 font-light">
                                    <span>{event.time}</span>
                                    <span>&bull;</span>
                                    <span>{event.location}</span>
                                </div>
                                <p className="mt-4 text-white/90 font-light">{event.description}</p>
                                <a href="#" onClick={(e) => handleComingSoon(e, 'RSVP form coming soon!')} className="mt-6 inline-block bg-white text-[#A94438] px-6 py-2 text-sm font-bold tracking-wider hover:bg-gray-200 transition-colors">
                                    RSVP
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Services: React.FC = () => {
    return (
        <section id="lessons" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-start">
                <div>
                    <h2 className="text-5xl font-['Bebas_Neue'] text-[#A94438] tracking-wider">
                        SERVICES
                    </h2>
                    <div className="mt-12 space-y-12">
                        <div>
                            <h3 className="text-2xl font-['Bebas_Neue'] text-black tracking-wider">SKATE LESSONS</h3>
                            <p className="mt-2 text-gray-600">Learn skating skills with group or private lessons for all ages.</p>
                            <a href="#" onClick={(e) => handleComingSoon(e, 'Lesson booking coming soon!')} className="mt-2 inline-block text-[#A94438] font-bold border-b border-[#A94438] hover:text-[#933a2f] hover:border-[#933a2f]">Join a Lesson</a>
                        </div>
                        <div>
                            <h3 className="text-2xl font-['Bebas_Neue'] text-black tracking-wider">BEGINNERS WELCOME</h3>
                            <p className="mt-2 text-gray-600">Special programs designed for beginners to learn skating fundamentals.</p>
                            <a href="#" onClick={(e) => handleComingSoon(e, 'More details coming soon!')} className="mt-2 inline-block text-[#A94438] font-bold border-b border-[#A94438] hover:text-[#933a2f] hover:border-[#933a2f]">Learn More</a>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                     <img src="https://picsum.photos/seed/trophycase/500/600" alt="Trophy case" className="w-full h-auto max-w-md object-cover" />
                </div>
            </div>
        </section>
    );
};

const Gallery: React.FC = () => {
    const images = [
        'https://picsum.photos/seed/gallery1/600/400',
        'https://picsum.photos/seed/gallery2/600/400',
        'https://picsum.photos/seed/gallery3/600/400',
        'https://picsum.photos/seed/gallery4/600/400',
        'https://picsum.photos/seed/gallery5/600/400',
        'https://picsum.photos/seed/gallery6/600/400',
    ];

    return (
        <section id="gallery" className="py-20 bg-[#FAF8F5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-5xl font-['Bebas_Neue'] text-[#A94438] tracking-wider text-center">
                    GALLERY
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-12">
                    {images.map((src, index) => (
                        <div key={index} className="overflow-hidden aspect-w-4 aspect-h-3">
                            <img src={src} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


const Footer: React.FC = () => {
    return (
        <footer className="bg-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} FUNSPOT. All rights reserved.</p>
            </div>
        </footer>
    );
};


export const App: React.FC = () => {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <JoinClub />
                <Events />
                <Services />
                <Gallery />
            </main>
            <Footer />
        </>
    );
};

export class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(_: Error): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold mb-2">Something went wrong.</h2>
            <p className="text-gray-400 mb-6 max-w-sm">We've been notified and are working to fix the issue. Please try refreshing the page.</p>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors" onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}