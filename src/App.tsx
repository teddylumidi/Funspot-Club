import React, { ReactNode } from 'react';

const FlyerHero: React.FC = () => {
    return (
        <section className="relative w-full bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/hero-bg/1000/600')" }}>
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            
            <div className="relative z-10 flex flex-col items-center pt-20 pb-32 md:pt-24 md:pb-40 text-center text-white">
                <h1 className="font-['Bebas_Neue'] text-7xl sm:text-8xl md:text-9xl -rotate-3 transform">
                    <span className="text-white text-outline">Learn</span>
                    {' '}
                    <span className="text-yellow-400 text-outline">SKATING</span>
                </h1>
                <p className="font-['Bebas_Neue'] text-white text-xl md:text-2xl tracking-widest mt-4 px-6 py-1 bg-black bg-opacity-60 rounded">CONQUER YOUR FEAR, GAIN THE EXPERIENCE</p>
            </div>

            {/* This div creates the torn paper effect by having an svg mask */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gray-100" style={{
                clipPath: 'polygon(0 100%, 100% 100%, 100% 26%, 94% 38%, 86% 23%, 78% 34%, 70% 22%, 62% 40%, 53% 25%, 46% 38%, 38% 23%, 30% 36%, 22% 23%, 14% 38%, 7% 24%, 0 38%)'
            }}></div>
        </section>
    );
};

const FlyerContent: React.FC = () => {
    return (
        // The -mt-1 is a small adjustment to ensure the clip-path meets the hero section perfectly
        <div className="relative bg-gray-100 -mt-1 pb-10">
            {/* The collage of circles */}
            <div className="relative flex justify-center items-end space-x-[-2rem] md:space-x-[-3rem] z-20" style={{ marginTop: '-70px' }}>
                <img src="https://picsum.photos/seed/kid1/200/200" alt="Skating kid 1" className="w-28 h-28 md:w-40 md:h-40 object-cover rounded-full border-4 border-white shadow-lg transform rotate-[-10deg]"/>
                <img src="https://picsum.photos/seed/kid2/200/200" alt="Skating kid 2" className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-full border-4 border-white shadow-lg z-10 mb-4"/>
                <img src="https://picsum.photos/seed/kid3/200/200" alt="Skating kid 3" className="w-28 h-28 md:w-40 md:h-40 object-cover rounded-full border-4 border-white shadow-lg transform rotate-[10deg]"/>
            </div>

            <div className="relative bg-[#0077C0] text-white pt-10 mt-[-4rem]">
                {/* Top wave/torn effect */}
                 <div className="absolute top-0 left-0 w-full h-20" style={{ transform: 'translateY(-99%)' }}>
                    <svg className="w-full h-full" viewBox="0 0 1440 80" preserveAspectRatio="none" fill="#0077C0">
                        <path d="M1440 80H0V40.5C28.23 44.82 101.5 59.5 197.5 52C314.5 42.5 393.5 4 521 4C648.5 4 721 27 826 36.5C931 46 996 27 1109 27C1222 27 1317.5 46 1440 56V80Z"></path>
                    </svg>
                </div>
                
                {/* The main content within the blue shape */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-x-8 pb-72 md:pb-96 min-h-[500px]">
                    {/* Left Info Box */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-md mx-auto md:mx-0 text-gray-800">
                        <h2 className="font-['Bebas_Neue'] text-4xl md:text-5xl tracking-wider">BECOME STRONGER</h2>
                        <ul className="mt-6 space-y-3 text-lg list-disc list-inside">
                            <li>Pundamental Training</li>
                            <li>Searn how to Glide</li>
                        </ul>
                        <div className="mt-8">
                            <a href="#" className="inline-block bg-[#F37321] text-white px-10 py-3 text-lg font-bold rounded-full hover:bg-opacity-90 transition-transform hover:scale-105 shadow-lg">
                                Enroll Now
                            </a>
                        </div>
                    </div>

                    {/* Right Logo Area */}
                     <div className="text-white text-center md:text-left mt-8 md:mt-0">
                         <h3 className="font-['Bebas_Neue'] text-6xl md:text-8xl tracking-wider uppercase">Funport</h3>
                         <h3 className="font-['Bebas_Neue'] text-6xl md:text-8xl tracking-wider uppercase -mt-4 md:-mt-8">Skating <span className="text-3xl md:text-4xl align-middle">club</span></h3>
                         <p className="font-['Bebas_Neue'] text-2xl md:text-3xl text-yellow-300 tracking-wider mt-2">SUMMER WEEKLY PROGRAM &</p>
                         <p className="font-['Bebas_Neue'] text-2xl md:text-3xl text-yellow-300 tracking-wider">WEEKEND SESSIONS</p>
                    </div>
                </div>
                
                {/* The large overlapping image */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-20">
                     <img src="https://picsum.photos/seed/family-skate/800/1000" alt="Family skating" className="w-full h-auto object-cover rounded-lg shadow-2xl"/>
                </div>

                {/* Bottom wave effect */}
                <div className="absolute bottom-0 left-0 w-full h-24" >
                     <svg className="w-full h-full" viewBox="0 0 1440 100" preserveAspectRatio="none" fill="#FFFFFF">
                        <path d="M1440 100H0V43.5C216 68 335.5 30 528.5 30S780 88.5 932.5 73.5C1085 58.5 1209.5 0 1440 0V100Z"></path>
                     </svg>
                </div>
            </div>
        </div>
    );
};

const FlyerFooter: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white relative z-30">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-sm">
                <p>&copy; 2023 Fun For Skating Club. All Dror rerresrred.</p>
            </div>
        </footer>
    );
};


export const App: React.FC = () => {
    return (
        <div className="bg-white">
            <main>
                <FlyerHero />
                <FlyerContent />
            </main>
            <FlyerFooter />
        </div>
    );
};

export class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
  // FIX: Explicitly define a constructor to initialize state. While using a class property for state is valid, 
  // this approach ensures `super(props)` is called and `this.state` is set, which can resolve potential 
  // compilation or environment-specific issues causing `this.props` to be undefined.
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

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
