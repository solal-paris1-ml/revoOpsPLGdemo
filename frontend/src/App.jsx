import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import logo from './logo.png';
import logoPerson from './data-person.jpg';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const tools = [
  {
    id: 1,
    name: 'Product One',
    category: 'Category A',
    description: 'Product One is a powerful solution for modern teams.',
    features: ['Feature 1', 'Feature 2', 'Feature 3']
  },
  {
    id: 2,
    name: 'Product Two',
    category: 'Category B',
    description: 'Product Two helps you scale your business efficiently.',
    features: ['Feature A', 'Feature B', 'Feature C']
  }
];

const logEvent = async (type, toolName, details) => {
  try {
    await axios.post(`${API_URL}/api/event`, { type, toolName, details });
  } catch (e) {
    // Optionally handle error
  }
};

const DataPersonDropdown = () => (
  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-6 z-50 border border-gray-200">
    <div className="flex items-center gap-4">
      <img src={logoPerson} alt="Data Person" className="w-20 h-20 rounded-full object-cover border" />
      <div>
        <div className="font-bold text-lg text-gray-900 mb-1">Solal</div>
        <div className="text-gray-700 text-sm">Solal is an AI consultant turned aspiring RevOps wizard—because who says machine learning can't help align sales, marketing, and ops? He brings data-driven strategies and just enough Python to automate half your workflow.</div>
      </div>
    </div>
  </div>
);

const Navbar = () => {
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-40">
      <div className="flex items-center gap-8">
        <span className="text-2xl font-extrabold tracking-tight bg-lime-300 px-4 py-1 rounded text-gray-900">PLG DEMO</span>
        <Link to="/tools" className="text-lg font-medium text-gray-800 hover:text-lime-500 transition" onClick={() => logEvent('nav_click', 'our_products')}>Our Products</Link>
        <div className="relative"
          onMouseEnter={() => setShowCompanyDropdown(true)}
          onMouseLeave={() => setShowCompanyDropdown(false)}
        >
          <button
            className="text-lg font-medium text-gray-800 hover:text-lime-500 transition focus:outline-none"
            onClick={() => logEvent('nav_click', 'company')}
          >
            Company
          </button>
          {showCompanyDropdown && <DataPersonDropdown />}
        </div>
      </div>
    </nav>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <img src={logo} alt="Logo" className="w-96 h-96 mb-4 object-contain mx-auto" />
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          Welcome to our PLG Motion Simulator!
        </h1>
        <div className="h-1 w-32 bg-lime-300 mx-auto mb-6 rounded" />
        <p className="text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
          This demo lets you explore two example products and simulate user interactions, including event tracking and demo requests powered by HubSpot forms.
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
          <button
            className="bg-lime-300 text-gray-900 font-bold px-8 py-4 rounded-lg text-lg shadow hover:bg-lime-400 transition"
            onClick={() => {
              logEvent('contact_us_click', 'homepage');
              navigate('/contact/general');
            }}
          >
            Contact Us
          </button>
        </div>
      </main>
    </div>
  );
};

const SimpleProductCard = ({ tool, onLearnMore }) => (
  <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center w-full max-w-md border-2 border-lime-200">
    <h3 className="text-2xl font-bold text-gray-900 mb-2">{tool.name}</h3>
    <p className="text-gray-700 mb-4 text-center">{tool.description}</p>
    <span className="px-4 py-1 bg-lime-100 text-lime-800 rounded-full text-sm mb-2">{tool.category}</span>
    <button
      className="mt-4 text-lime-600 hover:underline font-semibold"
      onClick={onLearnMore}
    >
      Learn more
    </button>
  </div>
);

const ToolsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex flex-col items-center justify-center px-4 py-16">
      <h2 className="text-4xl font-extrabold text-white mb-10">Our Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl mb-12">
        {tools.map((tool) => (
          <SimpleProductCard
            key={tool.id}
            tool={tool}
            onLearnMore={() => {
              logEvent('learn_more_click', tool.name);
              navigate(`/contact/${tool.name.toLowerCase().replace(/ /g, '-')}`);
            }}
          />
        ))}
      </div>
      <button
        className="mt-8 bg-lime-300 text-gray-900 font-bold px-8 py-4 rounded-lg text-lg shadow hover:bg-lime-400 transition"
        onClick={() => {
          logEvent('back_to_home_click', 'our_products');
          navigate('/');
        }}
      >
        Back to Home page
      </button>
    </div>
  );
};

const ContactUsPage = () => {
  const { product } = useParams();
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', budget: '', message: '' });
  const navigate = useNavigate();
  const productName = product === 'product-one' ? 'Product One' : product === 'product-two' ? 'Product Two' : 'General';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/contact-message`, { ...form, product: productName });
      await logEvent('send_message_click', productName, form);
      
      if (response.data.status === 'ok') {
        alert('Thank you for your message! Your form has been submitted successfully.');
      } else if (response.data.warning) {
        alert(`Form submitted successfully, but there was a warning: ${response.data.warning}`);
      }
      
      setForm({ name: '', email: '', company: '', phone: '', budget: '', message: '' });
    } catch (err) {
      let errorMessage = 'There was an error sending your message.';
      
      if (err.response?.data?.error) {
        if (err.response.data.error.includes('already subscribed')) {
          errorMessage = 'Your message was received, but you are already subscribed to our marketing communications.';
        } else {
          errorMessage = `Error: ${err.response.data.error}`;
        }
      }
      
      alert(errorMessage);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-2">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-2 text-center">Contact Us</h1>
      <p className="text-lg text-gray-700 mb-10 text-center max-w-2xl">Have questions about our services or want to discuss how we can help your company? Get in touch with our team.</p>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 flex-1 min-w-[320px]">
          <h2 className="text-2xl font-bold mb-6">Send Us a Message {productName !== 'General' && <span className='text-lime-600'>({productName})</span>}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Name" className="border rounded px-4 py-2 w-full" />
            <input name="email" value={form.email} onChange={handleChange} required placeholder="Email" className="border rounded px-4 py-2 w-full" />
            <input name="company" value={form.company} onChange={handleChange} placeholder="Company" className="border rounded px-4 py-2 w-full" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone (Optional)" className="border rounded px-4 py-2 w-full" />
          </div>
          <div className="mb-4">
            <select name="budget" value={form.budget} onChange={handleChange} className="border rounded px-4 py-2 w-full">
              <option value="">Select a budget range (Optional)</option>
              <option value="< $1,000">&lt; $1,000</option>
              <option value="$1,000 - $5,000">$1,000 - $5,000</option>
              <option value="$5,000 - $10,000">$5,000 - $10,000</option>
              <option value="> $10,000">&gt; $10,000</option>
            </select>
          </div>
          <div className="mb-6">
            <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Message" className="border rounded px-4 py-2 w-full" />
          </div>
          <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-900 transition">Send Message</button>
        </form>
        <div className="bg-gray-50 rounded-2xl shadow-lg p-8 flex-1 min-w-[320px] border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Get in Touch</h2>
          <div className="mb-4">
            <div className="font-semibold">Email</div>
            <a href="mailto:villesolal@gmail.com" className="text-gray-700 hover:underline">villesolal@gmail.com</a>
          </div>
          <div className="mb-4">
            <div className="font-semibold">Get In Touch</div>
            <div>Chat with one of our team to discuss your needs.</div>
            <a href="mailto:villesolal@gmail.com" className="mt-2 inline-block bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-900 transition" onClick={() => logEvent('chat_with_us_click', productName)}>Chat with Us</a>
          </div>
          <div className="mb-4">
            <div className="font-semibold">Headquarters</div>
            <div>Paris, France<br />Remote-first company</div>
          </div>
          <div>
            <div className="font-semibold mb-1">Follow Us</div>
            <a href="https://www.linkedin.com/in/solalville/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:underline flex items-center gap-2">
              <svg width="20" height="20" fill="currentColor" className="inline"><path d="M16 8a6 6 0 1 0-12 0 6 6 0 0 0 12 0zm-6 8a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-7v4H7v-4h2zm0-2H7V7h2v2zm4 2v4h-2v-4h2zm0-2h-2V7h2v2z"/></svg>
              LinkedIn
            </a>
          </div>
        </div>
      </div>
      <button
        className="mt-12 bg-lime-300 text-gray-900 font-bold px-8 py-4 rounded-lg text-lg shadow hover:bg-lime-400 transition"
        onClick={() => {
          logEvent('back_to_homepage_click', productName);
          navigate('/');
        }}
      >
        Back to homepage
      </button>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/contact/:product" element={<ContactUsPage />} />
      </Routes>
    </Router>
  );
};

export default App; 