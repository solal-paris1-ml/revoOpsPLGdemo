import React from 'react';

const ToolCard = ({ tool, onLearnMore }) => (
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

export default ToolCard; 