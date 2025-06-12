import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ToolPage = ({ tools }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const tool = tools.find(t => t.id === parseInt(id));

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await axios.post('http://localhost:3001/api/event', {
          type: 'tool_page_view',
          toolName: tool.name
        });
      } catch (error) {
        console.error('Failed to send event:', error);
      }
    };
    trackPageView();
  }, [tool]);

  if (!tool) {
    return <div>Tool not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-blue-600 hover:text-blue-800"
        >
          ← Back to Tools
        </button>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{tool.name}</h1>
          <p className="text-gray-600 mb-6">{tool.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Category</h3>
              <p className="text-gray-600">{tool.category}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Features</h3>
              <ul className="list-disc list-inside text-gray-600">
                {tool.features?.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                axios.post('http://localhost:3001/api/event', {
                  type: 'signup_click',
                  toolName: tool.name
                });
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={() => {
                axios.post('http://localhost:3001/api/event', {
                  type: 'demo_click',
                  toolName: tool.name
                });
              }}
              className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Request Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolPage; 