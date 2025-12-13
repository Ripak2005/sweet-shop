import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const highlightSweets = [
  {
    name: 'Belgian Chocolate Truffle',
    tag: 'Trending',
    desc: 'Silky ganache with 72% cocoa, hand-rolled and dusted.',
    badge: '4.9★',
    color: '#fff4e6'
  },
  {
    name: 'Rose Pistachio Barfi',
    tag: 'Editor’s Pick',
    desc: 'Slow-cooked khoya with toasted pistachio and rose petals.',
    badge: 'Chef Craft',
    color: '#f3f8ff'
  },
  {
    name: 'Salted Caramel Éclair',
    tag: 'New',
    desc: 'Choux pastry filled with salted caramel cream and glaze.',
    badge: 'New Drop',
    color: '#f7f3ff'
  }
];

const steps = [
  {
    title: 'Search & crave',
    desc: 'Browse artisan sweets, mithai, chocolates, and nostalgic picks.',
    icon: '🔍'
  },
  {
    title: 'Pick your box',
    desc: 'Mix-and-match categories, add notes, and lock in freshness.',
    icon: '🍱'
  },
  {
    title: 'Deliver happiness',
    desc: 'Track your order in real time and enjoy same-day dispatch.',
    icon: '🚚'
  }
];

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <main className="home">
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Sweet Shop • Crafted with love</p>
              <h1>Discover sweets, desserts, and mithai near you</h1>
              <p className="subtext">
                Curated collections, chef specials, and festival boxes — pick your favorites
                and get them delivered fresh.
              </p>
              <div className="hero-actions">
                <Link to={isAuthenticated ? '/dashboard' : '/login'} className="btn btn-primary">
                  {isAuthenticated ? 'Go to dashboard' : 'Explore now'}
                </Link>
                {!isAuthenticated && (
                  <Link to="/register" className="btn btn-secondary">
                    Create account
                  </Link>
                )}
              </div>
              <div className="hero-tags">
                <span>Chocolate</span>
                <span>Indian Mithai</span>
                <span>Vegan</span>
                <span>Gift Boxes</span>
              </div>
            </div>

            <div className="hero-card">
              <div className="hero-card-header">Tonight’s picks</div>
              <div className="hero-card-body">
                {highlightSweets.map((item) => (
                  <div key={item.name} className="hero-card-item" style={{ backgroundColor: item.color }}>
                    <div>
                      <p className="tag">{item.tag}</p>
                      <h3>{item.name}</h3>
                      <p className="desc">{item.desc}</p>
                    </div>
                    <span className="badge">{item.badge}</span>
                  </div>
                ))}
              </div>
              <div className="hero-card-footer">Fresh batches baked every 3 hours · No artificial colors</div>
            </div>
          </div>
        </section>

        <section className="section cards">
          <div className="container">
            <div className="section-header">
              <h2>Explore by mood</h2>
              <p>From festival hampers to late-night chocolate fixes.</p>
            </div>
            <div className="grid grid-cols-3">
              <div className="info-card" style={{ borderColor: '#ff7043' }}>
                <p className="tag">Festive</p>
                <h3>Diwali & Gifting</h3>
                <p>Create custom mithai boxes with personal notes.</p>
              </div>
              <div className="info-card" style={{ borderColor: '#7c4dff' }}>
                <p className="tag">Vegan</p>
                <h3>Plant-based Treats</h3>
                <p>Dairy-free chocolate, nut butters, and fruit pops.</p>
              </div>
              <div className="info-card" style={{ borderColor: '#00bfa5' }}>
                <p className="tag">Late-night</p>
                <h3>Midnight Desserts</h3>
                <p>Warm brownies, gooey cookies, and mini cakes.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section steps">
          <div className="container">
            <div className="section-header">
              <h2>Order in three steps</h2>
              <p>Simple, fast, and delightful.</p>
            </div>
            <div className="grid grid-cols-3">
              {steps.map((step) => (
                <div key={step.title} className="step-card">
                  <div className="step-icon">{step.icon}</div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section cta">
          <div className="container cta-card">
            <div>
              <p className="eyebrow">Handcrafted • Fresh • Fast</p>
              <h2>Ready to taste the best sweets in town?</h2>
              <p className="subtext">
                Join thousands of dessert lovers discovering new favorites every week.
              </p>
            </div>
            <div className="cta-actions">
              <Link to={isAuthenticated ? '/dashboard' : '/login'} className="btn btn-primary">
                {isAuthenticated ? 'Open dashboard' : 'Start tasting'}
              </Link>
              {!isAuthenticated && (
                <Link to="/register" className="btn btn-secondary">
                  Join the club
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
