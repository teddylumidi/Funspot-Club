import React, { ReactNode, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BellRing,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Gauge,
  HeartHandshake,
  Inbox,
  LayoutDashboard,
  Megaphone,
  MessageCircle,
  NotebookPen,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Timer,
  Trophy,
  Users,
  CalendarRange,
  UserPlus,
  Globe2,
  LogIn,
  FileText
} from 'lucide-react';

const heroMain = new URL('../images/hero.png', import.meta.url).href;
const skatingImage = new URL('../images/1.png', import.meta.url).href;
const swimmingImage = new URL('../images/2.png', import.meta.url).href;
const chessImage = new URL('../images/3.png', import.meta.url).href;

const heroGalleryImages = [swimmingImage, chessImage, skatingImage];

type NavLink = {
  label: string;
  href: string;
  children?: Array<{ label: string; href: string }>;
};

const navigation: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Management Suite', href: '#management' },
  { label: 'Sign Ups', href: '#signups' },
  {
    label: 'Programs & Training',
    href: '#programs',
    children: [
      { label: 'Skating', href: '#skating' },
      { label: 'Swimming', href: '#swimming' },
      { label: 'Chess', href: '#chess' },
      { label: 'Other Activities', href: '#other-activities' }
    ]
  },
  { label: 'Subject Management', href: '#subjects' },
  {
    label: 'Events',
    href: '#events',
    children: [
      { label: 'Upcoming Events', href: '#events' },
      { label: 'Past Events Archive', href: '#events-archive' }
    ]
  },
  { label: 'Coaches', href: '#coaches' },
  { label: 'Athletes', href: '#athletes' },
  { label: 'Parents Portal', href: '#parents' },
  {
    label: 'Dashboards',
    href: '#dashboards',
    children: [
      { label: 'Admin Dashboard', href: '#dashboard-admin' },
      { label: 'Coach Dashboard', href: '#dashboard-coach' },
      { label: 'Athlete Dashboard', href: '#dashboard-athlete' },
      { label: 'Parent Dashboard', href: '#dashboard-parent' },
      { label: 'Training Reports', href: '#reports' }
    ]
  },
  {
    label: 'Messaging',
    href: '#messaging',
    children: [
      { label: 'Private Messages', href: '#private-messages' },
      { label: 'Announcements', href: '#announcements' }
    ]
  },
  {
    label: 'Payments',
    href: '#payments',
    children: [
      { label: 'Pay with Card', href: '#pay-card' },
      { label: 'Pay with Mpesa', href: '#pay-mpesa' },
      { label: 'Payment History', href: '#payment-history' }
    ]
  },
  {
    label: 'Promotions & Exams',
    href: '#promotions',
    children: [
      { label: 'Athlete Levels (Beginner / Intermediate / Advanced)', href: '#promotions-levels' },
      { label: 'Training Reports & Milestones', href: '#reports' }
    ]
  },
  { label: 'Community Hub', href: '#community' },
  { label: 'Enroll / Sign Up', href: '#contact' }
];

const systemModules = [
  {
    title: 'Admin Command Center',
    description: 'Create coach, athlete, and under-18 accounts, configure modules, and audit finances in one secure view.',
    Icon: ShieldCheck
  },
  {
    title: 'Coach Management',
    description: 'Assign coaching pods, monitor certifications, and deliver individualized training plans.',
    Icon: ClipboardList
  },
  {
    title: 'Athlete Management',
    description: 'Track athlete journeys, guardians, and linked siblings with level progression and attendance history.',
    Icon: Trophy
  },
  {
    title: 'Parents Management',
    description: 'Connect guardians to under-18 athletes, handle consents, and surface balances instantly.',
    Icon: HeartHandshake
  },
  {
    title: 'Training Management',
    description: 'Build weekly timetables, indoor/outdoor rotations, and capture attendance + drill results.',
    Icon: Timer
  },
  {
    title: 'Subject Management',
    description: 'Toggle indoor chess labs and outdoor skating/swimming tracks—add or retire sessions anytime.',
    Icon: LayoutDashboard
  },
  {
    title: 'Training Reports',
    description: 'Convert training logs into shareable exam-style feedback for athletes and guardians.',
    Icon: NotebookPen
  },
  {
    title: 'Promotion Management',
    description: 'Visualize beginner, intermediate, and elite milestones with automated approval workflows.',
    Icon: BarChart3
  },
  {
    title: 'Payments & Reminders',
    description: 'Automate Mpesa and card billing with smart reminders that sync to every dashboard.',
    Icon: CreditCard
  },
  {
    title: 'Messaging Hub',
    description: 'Enable private chats, segmented announcements, and notice boards in a single hub.',
    Icon: MessageCircle
  },
  {
    title: 'Individual Logs',
    description: 'Role-based logs capture every update, visible only to the relevant coach, parent, or admin.',
    Icon: FileText
  },
  {
    title: 'Events & Public Portal',
    description: 'Publish upcoming events and public highlights while syncing past archives to role dashboards.',
    Icon: CalendarRange
  },
  {
    title: 'Public Dashboard',
    description: 'Share safe, high-level club stories and metrics with the community without exposing private data.',
    Icon: Globe2
  },
  {
    title: 'Mass Outreach',
    description: 'Broadcast updates to teams or the entire club with private, trackable messaging.',
    Icon: Megaphone
  }
];

const signupChannels = [
  {
    title: 'Admin-Initiated Accounts',
    description: 'Centralized onboarding for coaches, athletes, and under-18 guardians with approval workflows.',
    Icon: UserPlus
  },
  {
    title: 'Google Sign-In',
    description: 'One-click authentication with Google Workspace or personal accounts.',
    Icon: LogIn
  },
  {
    title: 'Microsoft Sign-In',
    description: 'Support for Microsoft Entra ID to align with school or corporate partners.',
    Icon: LayoutDashboard
  },
  {
    title: 'Phone Verification',
    description: 'SMS-based flows ideal for Mpesa-linked guardians and regional partners.',
    Icon: Smartphone
  },
  {
    title: 'Email Invitations',
    description: 'Secure email invites with temporary passwords and guardian pairing.',
    Icon: Inbox
  }
];

const subjectCatalog = [
  {
    id: 'indoor-subjects',
    title: 'Indoor Strategy Labs',
    summary: 'Modular chess experiences configurable by the admin to match seasons and cohorts.',
    Icon: MessageCircle,
    activities: ['Classic Ladder & Blitz', 'Team Battle Rooms', 'Puzzle Rush Arena', 'Coach-led analysis lounges']
  },
  {
    id: 'outdoor-subjects',
    title: 'Outdoor Performance Tracks',
    summary: 'Dynamic skating and swimming rotations with optional pop-up activities.',
    Icon: CalendarClock,
    activities: ['Artistic & Speed Skating Pods', 'Endurance Swim Sets', 'Recovery & Mobility Clinics', 'Seasonal pop-up camps']
  }
];

const communityHighlights = [
  {
    title: 'Public Dashboard',
    description: 'Curated highlights, announcements, and event teasers visible to the wider community.',
    Icon: Globe2
  },
  {
    title: 'Role-Based Event Feeds',
    description: 'Parents and coaches see upcoming and archived events automatically from their dashboards.',
    Icon: CalendarRange
  },
  {
    title: 'Private Mass Messaging',
    description: 'Launch segmented broadcasts—teams, parents, or all members—with read receipts.',
    Icon: Megaphone
  },
  {
    title: 'Individual Activity Logs',
    description: 'Every athlete, coach, and guardian sees a personalized timeline of interactions and balances.',
    Icon: FileText
  }
];

const quickHighlights = [
  {
    title: 'Weekly Programs',
    description: 'Flexible sessions for kids and adults with weekday & weekend formats.',
    Icon: CalendarClock
  },
  {
    title: 'Smart Dashboards',
    description: 'Athlete, coach, parent, and admin workspaces with KPIs and alerts.',
    Icon: LayoutDashboard
  },
  {
    title: 'Seamless Payments',
    description: 'Automated card & Mpesa billing with reminders and reconciliations.',
    Icon: CreditCard
  }
];

const programTracks = [
  {
    id: 'skating',
    title: 'Skating',
    description: 'Progressive pathway from fundamentals to competitive showcases with promotion checkpoints.',
    bullets: ['Fundamentals', 'Speed & Agility', 'Competition Readiness'],
    media: skatingImage
  },
  {
    id: 'swimming',
    title: 'Swimming',
    description: 'Stroke clinics, endurance lanes, and recovery sessions to cross-train athletes.',
    bullets: ['Technique Labs', 'Endurance Sets', 'Mobility & Recovery'],
    media: swimmingImage
  },
  {
    id: 'chess',
    title: 'Chess',
    description: 'Indoor strategy labs, tournament ladders, and tactical puzzles for agile minds.',
    bullets: ['Strategy Labs', 'Tournament Ladder', 'Coach Feedback'],
    media: chessImage
  },
  {
    id: 'other-activities',
    title: 'Other Activities',
    description: 'Seasonal bootcamps, dance-on-wheels, and admin-configurable workshops.',
    bullets: ['Flexible Scheduling', 'Pop-up Events', 'Community Partners'],
    media: heroMain
  }
];

const eventCards = [
  {
    title: 'Summer Skate Jam',
    date: 'July 20–21, 2025',
    location: 'Funspot Arena',
    description: 'Weekend intensive with clinics, relay races, and live finals streamed on the public dashboard.',
    media: skatingImage
  },
  {
    title: 'Family Splash & Glide',
    date: 'August 3, 2025',
    location: 'City Aquatics Centre',
    description: 'Cross-training splash day blending skating drills, pool recovery, and family relays.',
    media: heroMain
  }
];

const coachesSpotlight = [
  {
    title: 'Certified Coaching Team',
    description: 'Every lead coach holds national certification, safety credentials, and ongoing professional development.',
    Icon: ShieldCheck
  },
  {
    title: 'Structured Coaching Programs',
    description: 'Assign coaches by level, monitor load, collect feedback, and generate performance insights automatically.',
    Icon: ClipboardList
  }
];

const dashboardCards = [
  {
    id: 'dashboard-admin',
    role: 'Admin Dashboard',
    blurb: 'Finance snapshots, user management, promotion approvals, and automated reminders in one bird’s-eye view.',
    Icon: ShieldCheck,
    highlights: ['Global directory & roles', 'Cashflow & settlements', 'Promotion approvals']
  },
  {
    id: 'dashboard-coach',
    role: 'Coach Dashboard',
    blurb: 'Plan sessions, mark attendance, submit training reports, and chat with parents and athletes instantly.',
    Icon: ClipboardList,
    highlights: ['Calendar & availability', 'Training report flows', 'Direct messaging']
  },
  {
    id: 'dashboard-athlete',
    role: 'Athlete Dashboard',
    blurb: 'Track progress, balances, upcoming sessions, and event registrations tailored to each athlete profile.',
    Icon: Trophy,
    highlights: ['Level tracker', 'Session history', 'Pay-now shortcuts']
  },
  {
    id: 'dashboard-parent',
    role: 'Parent Dashboard',
    blurb: 'Linked children, progress timelines, balances, consent approvals, and announcements in one calm hub.',
    Icon: Users,
    highlights: ['Child switcher', 'Invoices & receipts', 'Notices & alerts']
  }
];

const paymentStreams = [
  {
    id: 'pay-card',
    title: 'Card Payments',
    description: 'Stripe/Paystack checkout with stored mandates, refunds, receipts, and export-ready statements.',
    Icon: CreditCard,
    logos: ['Visa', 'Mastercard', 'Stripe', 'Paystack']
  },
  {
    id: 'pay-mpesa',
    title: 'Mpesa Payments',
    description: 'Instant STK push with automatic callback reconciliation, balance updates, and reminder triggers.',
    Icon: Smartphone,
    logos: ['Mpesa', 'STK Push', 'Till / Paybill']
  },
  {
    id: 'payment-history',
    title: 'Payment History',
    description: 'Automated receipts, downloadable statements, and aging reports keep every family on track.',
    Icon: ClipboardList,
    logos: ['Statements', 'Receipts', 'Aging Reports']
  }
];

const paymentSupportHighlight = 'Payment History & Reminders keep families current with automated balance nudges, aging reports, and downloadable statements.';

const chatConversation = [
  { author: 'Coach Carter', role: 'coach', message: 'Hi Mrs. Mwangi! Liam crushed his backwards glide today.' },
  { author: 'Parent Mwangi', role: 'parent', message: 'Amazing! We noticed he’s more confident already. Anything to focus on?' },
  { author: 'Coach Carter', role: 'coach', message: 'Keep practicing crossovers this week. I’ve shared drills in his dashboard.' }
];

const announcements = [
  { title: 'Weekend Weather Watch', detail: 'Morning sessions move indoors. Check dashboard alerts for slot updates.', time: 'Posted 2h ago' },
  { title: 'Mpesa Maintenance', detail: 'Safaricom scheduled downtime tonight 11pm—card checkout remains live.', time: 'Posted 6h ago' },
  { title: 'Chess Blitz Night', detail: 'Sign-ups close Friday 5pm. Reserve on the Events page.', time: 'Posted 1d ago' }
];

const promotionTimeline = [
  {
    id: 'promotions-levels',
    level: 'Beginner',
    summary: 'Balance, braking, and safety fundamentals with guardian sign-off.',
    criteria: ['4+ training attendances', 'Safety checklist passed', 'Parent consent uploaded'],
    progress: 80
  },
  {
    id: 'promotions-intermediate',
    level: 'Intermediate',
    summary: 'Crossovers, agility, and endurance on mixed terrain.',
    criteria: ['Average score ≥ 75%', 'Coach recommendation', 'Performance log review'],
    progress: 55
  },
  {
    id: 'promotions-advanced',
    level: 'Advanced',
    summary: 'Routine choreography, competition prep, and leadership mentoring.',
    criteria: ['Competition readiness check', 'Admin approval', 'Community mentorship completed'],
    progress: 20
  }
];

const trainingReport = {
  athlete: 'Leo Smith',
  coach: 'Coach Carter',
  session: 'Skating Fundamentals — August 18, 2025',
  summary: 'Leo maintained balance through the full relay set and improved braking control by 15%. Next focus: smoother transitions into crossovers.',
  badges: ['Balance +15%', 'Confidence Boost', 'Attendance Streak 6'],
  updated: 'Updated Aug 18, 2025 at 4:32 PM'
};

const parentFeatures = [
  { title: 'Progress tracking', description: 'Timeline of achievements, promotions, and coach notes organised by child.' },
  { title: 'Balances & receipts', description: 'See outstanding balances, download receipts, and pay via card or Mpesa instantly.' },
  { title: 'Consent approvals', description: 'Digital approvals for events, media releases, and medical updates in seconds.' },
  { title: 'Direct coach messaging', description: 'Stay in sync with coach updates, training tips, and session reminders.' }
];

const contactChannels = [
  { label: 'Email', value: 'hello@funspotclub.com', href: 'mailto:hello@funspotclub.com' },
  { label: 'Phone', value: '+254 700 123 456', href: 'tel:+254700123456' },
  { label: 'Visit Us', value: 'Funspot Sports Centre, Nairobi' }
];

const utilityLinks = [
  { label: 'Contact Us', href: '#contact' },
  { label: 'Public Dashboard', href: '#public-dashboard' },
  { label: 'Privacy Policy', href: '#privacy' },
  { label: 'Terms & Conditions', href: '#terms' }
];

const StatBadge: React.FC<{ text: string }> = ({ text }) => (
  <span className="stat-badge">{text}</span>
);

const iconSizeProps = { size: 22 };

export const App: React.FC = () => {
  const [navOpen, setNavOpen] = useState(false);

  const closeNav = () => setNavOpen(false);

  return (
    <div className="app-shell" id="home">
      <header
        className="hero"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(18, 18, 27, 0.82) 0%, rgba(216, 27, 96, 0.6) 45%, rgba(120, 32, 88, 0.5) 100%), url(${heroMain})`
        }}
      >
        <nav className="hero__nav">
          <div className="brand">Funspot Skating Club</div>
          <button
            className={`nav-toggle${navOpen ? ' nav-toggle--open' : ''}`}
            type="button"
            onClick={() => setNavOpen(open => !open)}
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={navOpen}
          >
            <span className="nav-toggle__bars" aria-hidden="true" />
            <span className="sr-only">Menu</span>
          </button>
          <ul className={`nav-links${navOpen ? ' nav-links--open' : ''}`}>
            {navigation.map(item => (
              <li key={item.label} className={`nav-item${item.children ? ' nav-item--has-children' : ''}`}>
                <a
                  className="nav-link"
                  href={item.href}
                  aria-haspopup={item.children ? 'true' : undefined}
                  aria-expanded={item.children ? navOpen : undefined}
                  onClick={closeNav}
                >
                  {item.label}
                  {item.children && <span className="nav-chevron" aria-hidden="true">⌄</span>}
                </a>
                {item.children && (
                  <ul className="nav-dropdown">
                    {item.children.map(child => (
                      <li key={child.href}>
                        <a href={child.href} onClick={closeNav}>
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <a className="nav-cta" href="#contact">
            Enroll Now
          </a>
        </nav>
  {navOpen && <button className="nav-overlay" type="button" aria-hidden="true" tabIndex={-1} onClick={closeNav} />}

        <div className="hero__content">
          <div className="hero__copy">
            <span className="hero__kicker">Skate. Splash. Strategize.</span>
            <h1>Where fearless athletes launch and families stay in sync.</h1>
            <p>
              Empower admins, coaches, athletes, and parents with synchronized dashboards, automated payments,
              and configurable indoor/outdoor programs that keep every session on track.
            </p>
            <div className="hero__stats">
              <StatBadge text="Elite Skating & Aquatics Labs" />
              <StatBadge text="Coach · Athlete · Parent Dashboards" />
              <StatBadge text="Google · Microsoft · Phone · Email Sign-Ups" />
              <StatBadge text="Automated Card & Mpesa Billing" />
            </div>
            <div className="hero__actions">
              <a className="btn primary" href="#programs">
                Explore Programs
                <ArrowRight size={18} />
              </a>
              <a className="btn ghost" href="#dashboards">
                View Dashboards
              </a>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__spotlight">
              <img src={heroMain} alt="Coach strategizing with young athletes" />
              <div className="hero__spotlight-meta">
                <span>Featured Track</span>
                <strong>Galaxy Skate Collective</strong>
                <p>Fast-paced coaching pods, peer mentorship, and live dashboards built for fearless gliders.</p>
              </div>
            </div>
            <div className="hero__gallery">
              {heroGalleryImages.map((img, index) => (
                <img key={index} src={img} alt="Funspot highlight" />
              ))}
            </div>
          </div>
        </div>
      </header>

      <main>
        <section id="about" className="section quick-highlights">
          <div className="section__header">
            <h2>Why Families Choose Funspot</h2>
            <p>Modern experiences, safety-first coaching, and transparent communication—delivered in one unified club platform.</p>
          </div>
          <div className="quick-highlights__grid">
            {quickHighlights.map(item => (
              <div key={item.title} className="highlight-card">
                <div className="highlight-icon">
                  <item.Icon {...iconSizeProps} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="management" className="section system-overview">
          <div className="section__header">
            <h2>Unified Management Suite</h2>
            <p>Role-based controls let the admin orchestrate sign ups, dashboards, finances, and program modules with precision.</p>
          </div>
          <div className="hex-grid">
            {systemModules.map(module => (
              <div key={module.title} className="hex-card">
                <div className="hex-card__icon">
                  <module.Icon size={24} />
                </div>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="signups" className="section signups">
          <div className="section__header">
            <h2>Multi-Channel Sign Ups</h2>
            <p>Admins launch accounts for coaches, athletes, and their parents—while self-service flows cover Google, Microsoft, phone, and email logins.</p>
          </div>
          <div className="signups__grid">
            {signupChannels.map(channel => (
              <div key={channel.title} className="signup-card">
                <div className="signup-card__icon">
                  <channel.Icon size={22} />
                </div>
                <h3>{channel.title}</h3>
                <p>{channel.description}</p>
              </div>
            ))}
          </div>
          <div className="signups__note">
            <StatBadge text="Guardian-linked accounts for under-18 athletes" />
            <StatBadge text="Role-scoped dashboards with admin oversight" />
            <StatBadge text="Audit-ready activity histories" />
          </div>
        </section>

        <section id="programs" className="section programs">
          <div className="section__header">
            <h2>Programs & Training Tracks</h2>
            <p>From the rink to the pool and the strategy table, our curriculum evolves with each athlete’s goals.</p>
          </div>
          <div className="programs__grid">
            {programTracks.map(program => (
              <article key={program.id} id={program.id} className="program-card">
                <div className="program-card__media">
                  <img src={program.media} alt={`${program.title} program`} />
                </div>
                <div className="program-card__body">
                  <h3>{program.title}</h3>
                  <p>{program.description}</p>
                  <ul>
                    {program.bullets.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <a className="program-card__cta" href="#contact">
                    Learn More
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="subjects" className="section subjects">
          <div className="section__header">
            <h2>Subject Management</h2>
            <p>Curate indoor strategy labs and outdoor performance tracks. Admins can add or retire offerings with a click.</p>
          </div>
          <div className="subjects__grid">
            {subjectCatalog.map(subject => (
              <article key={subject.id} className="subject-card">
                <div className="subject-card__heading">
                  <subject.Icon size={24} />
                  <h3>{subject.title}</h3>
                </div>
                <p>{subject.summary}</p>
                <ul>
                  {subject.activities.map(activity => (
                    <li key={activity}>{activity}</li>
                  ))}
                </ul>
                <span className="subject-card__tag">Admin configurable</span>
              </article>
            ))}
          </div>
        </section>

        <section id="subjects" className="section subjects">
          <div className="section__header">
            <h2>Subject Management</h2>
            <p>Toggle indoor chess labs or outdoor skating and swimming rotations—admins add, remove, and tailor every activity in seconds.</p>
          </div>
          <div className="subjects__grid">
            {subjectCatalog.map(subject => (
              <article key={subject.id} className="subject-card">
                <div className="subject-card__icon">
                  <subject.Icon size={24} />
                </div>
                <h3>{subject.title}</h3>
                <p>{subject.summary}</p>
                <ul>
                  {subject.activities.map(activity => (
                    <li key={activity}>{activity}</li>
                  ))}
                </ul>
                <span className="subject-card__note">Admin configurable · Auto-syncs to dashboards & schedules</span>
              </article>
            ))}
          </div>
        </section>

        <section id="events" className="section events">
          <div className="section__header">
            <h2>Events & Competitions</h2>
            <p>Lock in the next big moments—our calendar blends high-energy competitions with family-first experiences.</p>
          </div>
          <div className="event-grid">
            {eventCards.map(event => (
              <div key={event.title} className="event-card">
                <div className="event-card__inner">
                  <div className="event-card__front">
                    <img src={event.media} alt={event.title} />
                    <div className="event-card__meta">
                      <span>{event.date}</span>
                      <span>{event.location}</span>
                    </div>
                    <h3>{event.title}</h3>
                  </div>
                  <div className="event-card__back">
                    <h4>{event.title}</h4>
                    <p>{event.description}</p>
                    <span className="event-card__cta">Register in the Events Dashboard</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div id="events-archive" className="events__footer">
            <a href="#reports">View Past Events Archive</a>
          </div>
        </section>

        <section id="coaches" className="section coaches">
          <div className="section__header">
            <h2>Meet the Coaching Collective</h2>
            <p>Our instructors bring decades of experience, real-time communication, and mentorship for every level.</p>
          </div>
          <div className="coaches__grid">
            {coachesSpotlight.map(card => (
              <div key={card.title} className="feature-card">
                <div className="feature-icon">
                  <card.Icon {...iconSizeProps} />
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="dashboards" className="section dashboards">
          <div className="section__header">
            <h2>Role-Based Dashboards</h2>
            <p>Interactive charts, logs, and updates tailored for every role keep the whole club aligned.</p>
          </div>
          <div className="dashboards__grid">
            {dashboardCards.map(card => (
              <div key={card.role} id={card.id} className="dashboard-card">
                <div className="dashboard-card__icon">
                  <card.Icon size={28} />
                </div>
                <h3>{card.role}</h3>
                <p>{card.blurb}</p>
                <ul>
                  {card.highlights.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="payments" className="section payments">
          <div className="section__header">
            <h2>Payments & Finance Automation</h2>
            <p>Collect tuition, event fees, and merchandise payments seamlessly with real-time reconciliation.</p>
          </div>
          <div className="payments__layout">
            {paymentStreams.map(stream => (
              <div key={stream.title} id={stream.id} className="payments__card">
                <div className="payments__icon">
                  <stream.Icon {...iconSizeProps} />
                </div>
                <h3>{stream.title}</h3>
                <p>{stream.description}</p>
                <div className="payments__logos">
                  {stream.logos.map(logo => (
                    <span key={logo}>{logo}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="payments__support">
            <BarChart3 size={22} />
            <p>{paymentSupportHighlight}</p>
          </div>
        </section>

        <section id="messaging" className="section messaging">
          <div className="section__header">
            <h2>Messaging & Announcements</h2>
            <p>Conversations stay contextual with chat, broadcast notices, and automated alerts across devices.</p>
          </div>
          <div className="messaging__layout">
            <div id="private-messages" className="chat-preview">
              <div className="chat-preview__header">
                <MessageCircle size={20} />
                <span>Coach ↔ Parent Chat</span>
              </div>
              <div className="chat-preview__body">
                {chatConversation.map((message, index) => (
                  <div key={`${message.author}-${index}`} className={`chat-bubble chat-bubble--${message.role}`}>
                    <strong>{message.author}</strong>
                    <p>{message.message}</p>
                  </div>
                ))}
              </div>
            </div>
            <div id="announcements" className="announcements">
              <div className="announcements__header">
                <BellRing size={20} />
                <span>Club Announcements</span>
              </div>
              <ul>
                {announcements.map(item => (
                  <li key={item.title} className="announcement-item">
                    <h4>{item.title}</h4>
                    <p>{item.detail}</p>
                    <span>{item.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="community" className="section community">
          <div className="section__header">
            <h2>Community & Public Experience</h2>
            <p>Give families and fans a window into the club while keeping private data locked behind role-based access.</p>
          </div>
          <div className="community__grid">
            {communityHighlights.map(highlight => (
              <div key={highlight.title} className="community-card">
                <div className="community-card__icon">
                  <highlight.Icon size={22} />
                </div>
                <h3>{highlight.title}</h3>
                <p>{highlight.description}</p>
              </div>
            ))}
          </div>
          <div className="community__cta">
            <a className="btn ghost" href="#public-dashboard">Preview Public Dashboard</a>
            <a className="btn primary" href="#messaging">Launch Mass Messaging</a>
          </div>
        </section>

        <section id="community" className="section community">
          <div className="section__header">
            <h2>Community & Public Outreach</h2>
            <p>Share highlights broadly while keeping private data secure—public stories and private dashboards live side by side.</p>
          </div>
          <div className="community__grid">
            {communityHighlights.map(item => (
              <div key={item.title} className="community-card">
                <div className="community-card__icon">
                  <item.Icon size={22} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
          <div className="community__cta">
            <a className="btn primary" href="#public-dashboard">Preview Public Dashboard</a>
            <a className="btn ghost" href="#messaging">Explore Messaging Hub</a>
          </div>
        </section>

  <span id="promotions" className="anchor-marker" aria-hidden="true" />
  <section id="athletes" className="section promotions">
          <div className="section__header">
            <h2>Athlete Promotions Timeline</h2>
            <p>Transparent pathways from first glide to elite performer, with criteria, progress, and approvals.</p>
          </div>
          <div className="promotions__timeline">
            {promotionTimeline.map(step => (
              <div key={step.level} id={step.id} className="timeline__item">
                <div className="timeline__badge">
                  <Trophy size={20} />
                </div>
                <div className="timeline__content">
                  <h3>{step.level}</h3>
                  <p>{step.summary}</p>
                  <div className="progress-bar">
                    <div className="progress-bar__fill" style={{ width: `${step.progress}%` }} />
                  </div>
                  <ul className="timeline__criteria">
                    {step.criteria.map(criteria => (
                      <li key={criteria}>
                        <CheckCircle2 size={16} />
                        <span>{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="reports" className="section reports">
          <div className="section__header">
            <h2>Training Reports & Logs</h2>
            <p>Every session generates structured insights for athletes, parents, coaches, and admins.</p>
          </div>
          <div className="reports__layout">
            <div className="report-card">
              <div className="report-card__eyebrow">
                <ClipboardList size={18} />
                Training Report Snapshot
              </div>
              <h3>{trainingReport.athlete}</h3>
              <p className="report-card__meta">
                {trainingReport.session} · Coach {trainingReport.coach}
              </p>
              <p>{trainingReport.summary}</p>
              <div className="report-card__badges">
                {trainingReport.badges.map(badge => (
                  <span key={badge}>{badge}</span>
                ))}
              </div>
              <span className="report-card__updated">{trainingReport.updated}</span>
            </div>
            <div className="report-support">
              <div>
                <Sparkles size={20} />
                <h3>AI-Assisted Summaries</h3>
                <p>Coaches can convert raw notes into parent-friendly recaps in seconds, ready for dashboards or emails.</p>
              </div>
              <div>
                <Timer size={20} />
                <h3>Attendance & Exam Logs</h3>
                <p>Automatic attendance sheets, exam results, and audit trails keep compliance effortless.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="parents" className="section parents">
          <div className="section__header">
            <h2>Parents Portal</h2>
            <p>A warm, transparent control centre for guardians to champion their young athletes.</p>
          </div>
          <div className="parent-portal__layout">
            <div className="parent-portal__visual">
              <img src={heroMain} alt="Parent cheering young skaters" />
              <div className="parent-portal__overlay">
                <Gauge size={18} />
                <span>Live Progress Dashboard</span>
              </div>
            </div>
            <div className="parent-portal__features">
              {parentFeatures.map(feature => (
                <div key={feature.title} className="parent-feature">
                  <HeartHandshake size={18} />
                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section cta">
          <div className="cta__inner">
            <div>
              <h2>Ready to Roll? Join Funspot Today.</h2>
              <p>Launch the Funspot Skating & Sports experience with dashboards, payments, messaging, and events tailored to your club.</p>
            </div>
            <div className="cta__actions">
              <a className="btn primary" href="#contact">
                Book a Demo
                <ArrowRight size={18} />
              </a>
              <a className="btn ghost" href="#contact">
                Enroll Now
              </a>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact">
          <div className="section__header">
            <h2>Contact Us</h2>
            <p>Our team is ready to help with enrollment, partnerships, and media requests.</p>
          </div>
          <div className="contact__grid">
            {contactChannels.map(channel => {
              const Wrapper: React.ElementType = channel.href ? 'a' : 'div';
              const wrapperProps = channel.href ? { href: channel.href, target: '_blank', rel: 'noreferrer' } : {};
              return (
                <Wrapper key={channel.label} className="contact-card" {...wrapperProps}>
                  <div>
                    <span>{channel.label}</span>
                    <p>{channel.value}</p>
                  </div>
                </Wrapper>
              );
            })}
          </div>
          <div className="contact__footer">
            <p id="public-dashboard">Public dashboards show announcements and events. Private dashboards require role-based login credentials.</p>
            <div className="contact__badges">
              <StatBadge text="Mobile-Friendly" />
              <StatBadge text="Secure & Role-Based" />
              <StatBadge text="Scalable Cloud Infrastructure" />
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__brand">
          <div className="brand">Funspot Skating Club</div>
          <p>Glide with confidence. Compete with heart. Grow together.</p>
        </div>
        <div className="footer__links">
          {utilityLinks.map(link => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="footer__legal" id="privacy">
          <h4>Privacy Policy</h4>
          <p>We safeguard member data with encrypted payments, role-based dashboards, and audit-ready activity logs.</p>
        </div>
        <div className="footer__legal" id="terms">
          <h4>Terms & Conditions</h4>
          <p>Participation requires adherence to Funspot safety standards, waiver agreements, and current payment plans.</p>
        </div>
        <div className="footer__contact">
          <Inbox size={18} />
          <span>hello@funspotclub.com · +254 700 123 456</span>
        </div>
        <p className="footer__copyright">© {new Date().getFullYear()} Funspot Skating Club. All rights reserved.</p>
      </footer>
    </div>
  );
};

// --- ERROR BOUNDARY ---
export class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(_: Error): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
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
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors" onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}