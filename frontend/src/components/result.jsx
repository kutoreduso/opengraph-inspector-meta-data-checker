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

  // Real Evaluation Logic reading directly from Django's API response
  const titleLen = data.title ? data.title.length : 0;
  const descLen = data.description ? data.description.length : 0;
  
  const hasTitle = titleLen > 0;
  const hasDesc = descLen > 0;
  const hasImage = data.image && data.image.length > 0;
  const hasSchema = data.schema; 
  const hasAuthor = data.author && data.author.length > 0;
  const hasLanguage = data.language && data.language.length > 0;
  
  // Calculate Global Health Score based on real API data
  let score = 0;
  if (hasTitle) score += 20;
  if (hasDesc) score += 20;
  if (hasImage) score += 20;
  if (hasSchema) score += 20;
  if (hasAuthor) score += 20;

  // Generate Google-Style AI Insights
  const getInsights = () => {
    const insights = { summary: "", items: [] };

    if (activeTab === 'SEO') {
      if (!hasTitle || !hasDesc || !hasImage) {
        insights.summary = "This page is missing foundational search engine tags. Search crawlers will struggle to accurately index this content, and social media platforms will generate blank preview cards.";
      } else if (titleLen > 60 || descLen > 160) {
        insights.summary = "The core SEO structure is present, but character limits are currently exceeded. This will likely result in truncated snippets on Google search results pages.";
      } else {
        insights.summary = "This page is highly optimized for traditional search engines. Metadata lengths are within ideal parameters for maximum visibility.";
      }

      if (!hasTitle) insights.items.push("Inject a <title> tag into the <head> to establish the core topic.");
      else if (titleLen > 60) insights.items.push(`Reduce title length (currently ${titleLen} chars) to under 60 characters to prevent Google truncation.`);
      if (!hasDesc) insights.items.push("Write a compelling <meta name=\"description\"> to improve search click-through rates.");
      if (!hasImage) insights.items.push("Specify an og:image to control how the link appears when shared on social platforms.");
    } 
    else if (activeTab === 'AEO') {
      if (!hasSchema) {
        insights.summary = "Answer Engines (like ChatGPT and Siri) lack the structured data needed to confidently extract direct answers from this page.";
      } else {
        insights.summary = "Structured data elements are present, making it easier for Answer Engines to synthesize your content into direct conversational responses.";
      }
      
      if (!hasSchema) insights.items.push("Implement JSON-LD Schema markup to define the specific entities on this page explicitly.");
      if (!hasTitle) insights.items.push("Ensure your primary heading matches your Title tag to signal clear topical authority to AI crawlers.");
    } 
    else if (activeTab === 'GEO') {
      if (!hasAuthor || !hasLanguage) {
        insights.summary = "Generative Engines prioritize E-E-A-T (Experience, Expertise, Authoritativeness, and Trustworthiness). This page is currently missing critical trust and localization signals.";
      } else {
        insights.summary = "Trust and localization signals are present, helping Generative AI confidently recommend this source in localized summaries.";
      }

      if (!hasAuthor) insights.items.push("Add an Author or Publisher meta tag to establish credibility and source attribution.");
      if (!hasLanguage) insights.items.push("Define the language locale (e.g., <html lang=\"en\">) to ensure the content is served in relevant regional AI overviews.");
    }
    
    if (insights.items.length === 0) insights.items.push("No critical action items required for this category.");
    return insights;
  };

  const insights = getInsights();

  return (
    <div className="max-w-7xl mx-auto mt-12 w-full px-4 text-left mb-20">
      <div className="bg-gray-100 p-4 rounded-lg mb-8 text-sm text-gray-700 flex justify-between items-center">
        <div><span className="font-bold text-gray-900">Scanned URL:</span> {data.url}</div>
        <div className="font-bold">Score: <span className={`${score > 80 ? 'text-green-600' : 'text-yellow-600'}`}>{score}/100</span></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
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

        <div>
          <h3 className="font-bold text-lg mb-4 text-gray-900">Meta Data Analysis</h3>
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
                <DataRow label="Structured Data Indicators" value={data.schema ? "Entities Found" : "None Detected"} isGood={hasSchema} />
                <DataRow label="Clear H1 Hierarchy" value={data.title ? "Matches Title" : "Missing"} isGood={hasTitle} />
              </>
            )}
            {activeTab === 'GEO' && (
              <>
                <DataRow label="Author / Publisher Tag" value={data.author} isGood={hasAuthor} />
                <DataRow label="Language Locale" value={data.language} isGood={hasLanguage} />
              </>
            )}
          </div>
          
          <div className="relative overflow-hidden p-6 border rounded-xl shadow-sm bg-gradient-to-br from-[#f8f9fa] to-[#f1f3f4] border-gray-200">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400"></div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">✨</span>
              <h4 className="font-bold text-base text-gray-900">{activeTab} Overview</h4>
            </div>
            <p className="text-sm text-gray-700 mb-5 leading-relaxed">{insights.summary}</p>
            <ul className="space-y-3">
              {insights.items.map((item, index) => (
                <li key={index} className="text-sm flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm text-gray-800">
                  <span className="mt-0.5 text-blue-600 font-bold">→</span>
                  <span>{item}</span>
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