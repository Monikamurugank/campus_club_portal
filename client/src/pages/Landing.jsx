import { Link } from 'react-router-dom';

const Landing = () => (
  <div>
    {/* Hero Section */}
    <section
      className="py-5 text-white text-center"
      style={{ background: 'linear-gradient(135deg, #1a3c2e 0%, #2d6a4f 100%)', minHeight: '70vh', display: 'flex', alignItems: 'center' }}
    >
      <div className="container">
        <h1 className="display-4 fw-bold mb-3">Campus Club Management Portal</h1>
        <p className="lead mb-4" style={{ maxWidth: 600, margin: '0 auto 2rem' }}>
          Discover clubs, join communities, attend events, and make the most of your college life.
        </p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link to="/signup" className="btn btn-light btn-lg px-4 fw-semibold" style={{ color: '#1a3c2e' }}>
            Get Started
          </Link>
          <Link to="/clubs" className="btn btn-outline-light btn-lg px-4">
            Browse Clubs
          </Link>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-5">
      <div className="container">
        <h2 className="text-center fw-bold mb-5" style={{ color: '#1a3c2e' }}>Why Join?</h2>
        <div className="row g-4">
          {[
            { icon: '🏛️', title: 'Discover Clubs', desc: 'Browse all campus clubs by category and find your community.' },
            { icon: '📅', title: 'Attend Events', desc: 'Register for workshops, fests, seminars, and more.' },
            { icon: '🤝', title: 'Connect', desc: 'Meet like-minded students and grow your network.' },
            { icon: '📊', title: 'Track Activity', desc: 'Manage your memberships and event registrations in one place.' },
          ].map((f) => (
            <div key={f.title} className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <div style={{ fontSize: '2.5rem' }}>{f.icon}</div>
                <h5 className="fw-bold mt-3" style={{ color: '#1a3c2e' }}>{f.title}</h5>
                <p className="text-muted small">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Landing;
