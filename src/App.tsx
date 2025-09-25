import React, { ReactNode } from 'react';

const Header: React.FC = () => {
    const navLinks = ['Monstertart', 'Crepury', 'Gooh lo Buber', 'Sameets kudin Flter', 'Frone', 'Vielen Us'];

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <a href="#" className="flex items-center space-x-2">
                             <svg className="h-10 w-10 text-[#0077C0]" width="51" height="58" viewBox="0 0 51 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.33013 18.5L25.5 6.5L46.6699 18.5V42.5L25.5 54.5L4.33013 42.5V18.5Z" stroke="#0077C0" strokeWidth="8"/>
                                <path d="M25.5 6.5V54.5" stroke="#0077C0" strokeWidth="2"/>
                            </svg>
                            <span className="text-xl font-bold text-gray-800 tracking-wider">Fun For Skating Club</span>
                        </a>
                    </div>
                    <nav className="hidden md:flex items-center space-x-6">
                        {navLinks.map((link, index) => (
                            <a key={link} href="#" className="text-sm font-medium text-gray-600 hover:text-[#0077C0] transition-colors">{link}</a>
                        ))}
                         <a href="#" className="bg-[#F37321] text-white px-4 py-2 text-sm font-bold rounded-md hover:bg-opacity-90 transition-colors">
                            Now
                        </a>
                    </nav>
                </div>
            </div>
        </header>
    );
};

const Hero: React.FC = () => {
    return (
        <section className="relative bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/herofamily/1600/1000')" }}>
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center text-white">
                <div className="relative inline-block">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzE5IiBoZWlnaHQ9IjI4MyIgdmlld0JveD0iMCAwIDcxOSAyODMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik03MTkgMEM2OTAuNDYxIDYuNjU0NjEgNjc0LjU0NyAxMi4xMTY5IDY0OC4xMTkgMTkuNTY5OEM1OTUuMjYyIDM0LjQ3NDYgNTQ0LjU4OCA0Mi4zMDYxIDQ5MS45NjIgNTguODg0M0M0MzkuMzM2IDc1LjQ2MjUgMzg0Ljc2IDg4Ljk3MTEgMzM1LjY3MiAxMDQuMjM1QzI4Ni41ODMgMTE5LjQ5OCAyNDIuOTgxIDEzMy4wOTEgMjA0Ljg2NyAxNTAuMTU5QzE2Ni43NTMgMTY3LjIyNyAxMzYuMTkgMTg2Ljc3IDk4LjQ0MDkgMjA2Ljk0N0M2MC42OTE3IDIyNy4xMjMgMTUuNzU4OSAyNDcuOTMzIDAgMjYwLjEwNFYyODNINzE5VjBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K" alt="Torn paper" className="w-full h-auto" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <h1 className="font-['Bebas_Neue'] text-5xl sm:text-7xl md:text-8xl lg:text-9xl -rotate-6 transform">
                            <span className="text-white text-outline">Learn</span> <span className="text-[#F37321] text-outline">SKATING</span>
                        </h1>
                        <p className="font-['Bebas_Neue'] text-white text-lg md:text-2xl tracking-widest mt-2 px-4 py-1 bg-black bg-opacity-50 rounded">CONQUER YOUR FEAR, GAIN THE EXPERIENCE</p>
                    </div>
                </div>

                <div className="relative flex justify-center items-center space-x-[-20px] md:space-x-[-40px] mt-[-40px] md:mt-[-60px]">
                    <img src="https://picsum.photos/seed/kid1/200/200" alt="Skating kid 1" className="w-24 h-24 md:w-40 md:h-40 object-cover rounded-full border-4 border-white shadow-lg transform rotate-[-15deg]"/>
                    <img src="https://picsum.photos/seed/kid2/200/200" alt="Skating kid 2" className="w-28 h-28 md:w-48 md:h-48 object-cover rounded-full border-4 border-white shadow-lg z-10"/>
                    <img src="https://picsum.photos/seed/kid3/200/200" alt="Skating kid 3" className="w-24 h-24 md:w-40 md:h-40 object-cover rounded-full border-4 border-white shadow-lg transform rotate-[15deg]"/>
                </div>
            </div>
        </section>
    );
};

const InfoSection: React.FC = () => {
    return (
        <div className="bg-[#0077C0] text-white relative py-20 px-4 sm:px-6 lg:px-8">
            {/* Top Torn Paper Effect */}
            <div className="absolute top-0 left-0 w-full h-8 bg-repeat-x" style={{
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0,10 Q25,5 50,8 Q75,2 100,10 L100,0 L0,0 Z" fill="white"/></svg>')`,
                backgroundSize: '100% 100%',
            }}></div>

            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left">
                    <h2 className="font-['Bebas_Neue'] text-5xl md:text-6xl tracking-wider">BECOME STRONGER</h2>
                    <ul className="mt-6 space-y-3 text-lg list-disc list-inside inline-block text-left">
                        <li>Fundamental Training</li>
                        <li>Learn how to Glide</li>
                        <li>Stopping Practice</li>
                    </ul>
                    <div className="mt-8">
                        <a href="#" className="inline-block bg-[#F37321] text-white px-10 py-3 text-lg font-bold rounded-full hover:bg-opacity-90 transition-transform hover:scale-105">
                            Enroll Now
                        </a>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-start space-y-8">
                    <div className="text-center md:text-left">
                         <span className="font-['Bebas_Neue'] text-4xl tracking-wider">Fun For Skating Club</span>
                         <p className="font-['Bebas_Neue'] text-2xl text-yellow-300 tracking-wider">SUMMER WEEKLY PROGRAM & WEEKEND SESSIONS</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                             <span className="font-['Bebas_Neue'] text-xl bg-[#F37321] px-2 rounded-md">3:30PM - 6:00PM</span>
                             <span className="text-lg">IHML Mall & VRE Mall, Malindi</span>
                        </div>
                         <div className="flex items-center space-x-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 12a1 1 0 112 0v2a1 1 0 11-2 0v-2zm1-8a1 1 0 00-1 1v4a1 1 0 102 0V5a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            <span className="text-lg">BUNTWANI WATERFRONT, MALINDI</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                             <div className="flex flex-col">
                                <span className="text-lg">+254 780 941 396</span>
                                <span className="text-lg">+254 713 715 158</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

             {/* Bottom Torn Paper Effect */}
            <div className="absolute bottom-0 left-0 w-full h-8 bg-repeat-x" style={{
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0,0 Q25,5 50,2 Q75,8 100,0 L100,10 L0,10 Z" fill="white"/></svg>')`,
                backgroundSize: '100% 100%',
            }}></div>
        </div>
    );
};

const FullWidthImage: React.FC = () => {
    return (
        <div className="w-full py-10 px-4 sm:px-6 lg:px-8">
            <img src="https://picsum.photos/seed/fullwidthfamily/1200/800" alt="Family of skaters posing" className="w-full h-auto object-cover max-w-7xl mx-auto"/>
        </div>
    );
};

const ContentSection: React.FC = () => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-['Bebas_Neue'] text-gray-800 tracking-wider text-center">
                    Skating Club Management Web App
                </h2>
                <div className="mt-8 text-gray-600 space-y-4">
                    <p>
                        Welcome to the Fun For Skating Club! We are dedicated to providing a safe, fun, and supportive environment for skaters of all ages and skill levels. Our club is more than just a place to skate; it's a community where friendships are formed and passions are nurtured.
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                        <li>
                            <strong>Expert Coaching:</strong> Our certified coaches are passionate about skating and are committed to helping you achieve your goals, whether you're taking your first steps on skates or mastering advanced techniques.
                        </li>
                        <li>
                            <strong>Community Events:</strong> We host a variety of events throughout the year, including skate nights, workshops, competitions, and holiday parties. There's always something exciting happening at our club!
                        </li>
                        <li>
                            <strong>All Ages and Abilities:</strong> We welcome everyone, from toddlers to adults. Our programs are designed to cater to different age groups and skill levels, ensuring that every member has a positive and rewarding experience.
                        </li>
                    </ul>
                    <p>
                        Join us to improve your skills, build confidence, and become part of a vibrant skating family. We look forward to seeing you on the rink!
                    </p>
                </div>
            </div>
        </section>
    );
}

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
                <p>&copy; {new Date().getFullYear()} Fun For Skating Club. All Dror rerresrred.</p>
            </div>
        </footer>
    );
};


export const App: React.FC = () => {
    return (
        <div className="bg-white">
            <Header />
            <main>
                <Hero />
                <InfoSection />
                <FullWidthImage />
                <ContentSection />
            </main>
            <Footer />
        </div>
    );
};

export class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
  // FIX: Replaced the constructor with a class property for state initialization.
  // This modern syntax resolves multiple TypeScript errors related to `this.state` and `this.props` 
  // not being recognized on the component instance, and also fixes the issue with props typing.
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