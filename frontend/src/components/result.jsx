import React, { useState } from 'react';

// 1. Helper Component for the Data Rows
const DataRow = ({ label, value, isGood }) => (
  <div className="flex justify-between items-center p-4 text-sm border-b border-gray-100 last:border-0">
    <div className="flex-1 truncate mr-4">
      <span className="font-bold block text-gray-900">{label}</span>
      <span className="text-gray-600 truncate block">{value || "None found"}</span>
    </div>
    <div>
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${isGood ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {isGood ? 'Good' : 'Missing'}
      </span>
    </div>
  </div>
);

// 2. Main Results Component
const ResultsDashboard = ({ data }) => {
  const [activeTab, setActiveTab] = useState('SEO');
  if (!data) return null;

  // Evaluation Logic (Safely handling data from Django)
  const titleLen = data.title ? data.title.length : 0;
  const descLen = data.description ? data.description.length : 0;
  
  // Basic SEO
  const hasTitle = titleLen > 0;
  const hasDesc = descLen > 0;
  const hasImage = data.image && data.image.length > 0;
  
  // AEO & GEO (Mocking these until you update Django to scrape them)
  const hasSchema = data.schema !== undefined ? data.schema : false; // JSON-LD
  const hasAuthor = data.author !== undefined ? data.author : false;
  const hasLanguage = data.language !== undefined ? data.language : false;
  
  // Calculate Global Health Score
  let score = 0;
  if (hasTitle) score += 20;
  if (hasDesc) score += 20;
  if (hasImage) score += 20;
  if (hasSchema) score += 20;
  if (hasAuthor) score += 20;

  let scoreColor = "bg-red-500";
  if (score > 40) scoreColor = "bg-yellow-500";
  if (score > 80) scoreColor = "bg-[#00d632]";

  // Generate Tab-Specific Suggestions
  const getSuggestions = () => {
    const suggestions = [];
    if (activeTab === 'SEO') {
      if (!hasTitle) suggestions.push("Add a <title> tag to rank on traditional search engines.");
      else if (titleLen > 60) suggestions.push(`Title (${titleLen} chars) is too long. Keep under 60 chars.`);
      
      if (!hasDesc) suggestions.push("Add a <meta name=\"description\"> tag for search results.");
      if (!hasImage) suggestions.push("Add an og:image for social media previews.");
    } 
    else if (activeTab === 'AEO') {
      if (!hasSchema) suggestions.push("Missing JSON-LD Schema. Answer Engines (like Alexa/Siri) need structured data to understand your content.");
      suggestions.push("Ensure your page includes explicit Q&A formats for AI extraction.");
    } 
    else if (activeTab === 'GEO') {
      if (!hasAuthor) suggestions.push("Missing Author/Publisher tags. Generative Engines prioritize E-E-A-T (Expertise & Trust).");
      if (!hasLanguage) suggestions.push("Missing Locale/Language tags. AI overviews need context on regional relevance.");
    }
    
    if (suggestions.length === 0) suggestions.push("Looks great! No critical errors in this category.");
    return suggestions;
  };

  return (
    <div className="max-w-7xl mx-auto mt-12 w-full px-4 text-left mb-20">
      {/* Status Header */}
      <div className="bg-gray-100 p-4 rounded-lg mb-8 text-sm text-gray-700 flex justify-between items-center">
        <div><span className="font-bold text-gray-900">Scanned URL:</span> {data.url}</div>
        <div className="font-bold">Score: <span className={`${score > 80 ? 'text-green-600' : 'text-yellow-600'}`}>{score}/100</span></div>
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
          
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-300 mb-4">
            {['SEO', 'AEO', 'GEO'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 font-bold text-sm transition-colors ${
                  activeTab === tab 
                    ? 'border-b-2 border-green-500 text-green-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'SEO' && 'Search (SEO)'}
                {tab === 'AEO' && 'Answer Engine (AEO)'}
                {tab === 'GEO' && 'Generative (GEO)'}
              </button>
            ))}
          </div>

          {/* Dynamic Tab Content */}
          <div className="border border-gray-300 rounded-xl bg-white shadow-sm mb-6">
            {activeTab === 'SEO' && (
              <>
                <DataRow label="Page Title (<title>)" value={data.title} isGood={hasTitle} />
                <DataRow label="Meta Description" value={data.description} isGood={hasDesc} />
                <DataRow label="OpenGraph Image (og:image)" value={data.image ? "Image Found" : null} isGood={hasImage} />
              </>
            )}
            {activeTab === 'AEO' && (
              <>
                <DataRow label="Structured Data (JSON-LD)" value={data.schema ? "Present" : "Missing"} isGood={hasSchema} />
                <DataRow label="Clear H1 Hierarchy" value={data.title ? "Matches Title" : "Missing"} isGood={hasTitle} />
              </>
            )}
            {activeTab === 'GEO' && (
              <>
                <DataRow label="Author / Publisher Tag" value={data.author} isGood={hasAuthor} />
                <DataRow label="Language Locale (og:locale)" value={data.language} isGood={hasLanguage} />
              </>
            )}
          </div>
          
          {/* Dynamic Suggestions Panel */}
          <div className={`p-5 border rounded-xl shadow-sm bg-gray-50 border-gray-200`}>
            <h4 className="font-bold text-base mb-3 text-gray-800">
              {activeTab} Improvements
            </h4>
            <ul className="space-y-2">
              {getSuggestions().map((suggestion, index) => (
                <li key={index} className="text-sm flex items-start gap-2 text-gray-700">
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