import React from 'react';

// 1. Helper Component for the Data Rows
const DataRow = ({ label, value, isGood }) => (
  <div className="flex justify-between items-center p-4 text-sm">
    <div className="flex-1 truncate mr-4">
      <span className="font-bold block text-gray-900">{label}</span>
      <span className="text-gray-600 truncate block">{value || "None found"}</span>
    </div>
    <div>
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${isGood ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {isGood ? 'Good' : 'Error'}
      </span>
    </div>
  </div>
);

// 2. Main Results Component
const ResultsDashboard = ({ data }) => {
  if (!data) return null;

  // Evaluation Logic
  const titleLen = data.title ? data.title.length : 0;
  const descLen = data.description ? data.description.length : 0;
  
  const hasTitle = titleLen > 0;
  const hasDesc = descLen > 0;
  const hasImage = data.image && data.image.length > 0;

  // Calculate SEO Health Score (0 to 100)
  let score = 0;
  if (hasTitle) score += 33;
  if (hasDesc) score += 33;
  if (hasImage) score += 34;

  // Determine Score Color
  let scoreColor = "bg-red-500";
  if (score > 40) scoreColor = "bg-yellow-500";
  if (score > 80) scoreColor = "bg-[#00d632]";

  // Generate Dynamic Suggestions
  const suggestions = [];
  
  if (!hasTitle) {
    suggestions.push("Missing Title: Add a <title> tag to your page's <head>.");
  } else if (titleLen > 60) {
    suggestions.push(`Title is too long (${titleLen} chars): Keep it under 60 characters so it doesn't get cut off on Google.`);
  }

  if (!hasDesc) {
    suggestions.push("Missing Description: Add a <meta name=\"description\"> tag to improve click-through rates.");
  } else if (descLen > 160) {
    suggestions.push(`Description is too long (${descLen} chars): Keep it under 160 characters for optimal display.`);
  } else if (descLen < 50) {
    suggestions.push(`Description is too short (${descLen} chars): Expand it to provide more context about your page.`);
  }

  if (!hasImage) {
    suggestions.push("Missing Image: Add a <meta property=\"og:image\"> tag so a preview image appears when shared on social media.");
  }

  if (suggestions.length === 0) {
    suggestions.push("Your meta tags look great! No major improvements needed.");
  }

  return (
    <div className="max-w-6xl mx-auto mt-12 w-full px-4 text-left mb-20">
      {/* Status Header */}
      <div className="bg-gray-100 p-4 rounded-lg mb-8 text-sm text-gray-700">
        <span className="font-bold text-gray-900">Scanned URL:</span> {data.url}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Column A: Live Social Preview */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-gray-900">Social Card Preview</h3>
          <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
            {hasImage ? (
              <img src={data.image} alt="OpenGraph Preview" className="w-full h-64 object-cover border-b border-gray-200" />
            ) : (
              <div className="w-full h-64 bg-gray-100 flex flex-col items-center justify-center text-gray-400 font-medium border-b border-gray-200">
                <span className="text-3xl mb-2">📸</span>
                No Image Provided
              </div>
            )}
            <div className="p-5 bg-gray-50">
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                {new URL(data.url).hostname}
              </div>
              <div className="font-bold text-gray-900 text-lg truncate mb-2">
                {data.title || "Missing Title"}
              </div>
              <div className="text-gray-600 text-sm line-clamp-2">
                {data.description || "Missing Description. This link will look blank on social media."}
              </div>
            </div>
          </div>
        </div>

        {/* Column B: Technical Data & Analysis */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-gray-900">Meta Data Analysis</h3>
          
          {/* SEO Health Score Graph */}
          <div className="bg-white border border-gray-300 rounded-xl p-5 mb-6 shadow-sm">
            <div className="flex justify-between items-end mb-2">
              <span className="font-bold text-gray-700">SEO Health Score</span>
              <span className="font-bold text-2xl text-gray-900">{score}/100</span>
            </div>
            {/* The Graph Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`${scoreColor} h-3 rounded-full transition-all duration-1000 ease-out`} 
                style={{ width: `${score}%` }}
              ></div>
            </div>
          </div>

          {/* Raw Tags Table */}
          <div className="border border-gray-300 rounded-xl bg-white divide-y divide-gray-200 shadow-sm mb-6">
            <DataRow label="Page Title (<title>)" value={data.title} isGood={hasTitle} />
            <DataRow label="Meta Description" value={data.description} isGood={hasDesc} />
            <DataRow label="OpenGraph Image (og:image)" value={data.image} isGood={hasImage} />
          </div>
          
          {/* Suggestions for Improvement Panel */}
          <div className={`p-5 border rounded-xl shadow-sm ${score === 100 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <h4 className={`font-bold text-base mb-3 ${score === 100 ? 'text-green-800' : 'text-yellow-800'}`}>
              Suggestions for Improvement
            </h4>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className={`text-sm flex items-start gap-2 ${score === 100 ? 'text-green-700' : 'text-yellow-700'}`}>
                  <span className="mt-0.5">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;