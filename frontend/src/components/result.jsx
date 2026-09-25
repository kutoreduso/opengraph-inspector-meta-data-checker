import React from 'react';

// 1. Add this Helper Component anywhere in your file (outside the main function)
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

// 2. Add this main Results Component (outside the main function)
const ResultsDashboard = ({ data }) => {
  if (!data) return null;

  // Logic to determine if a tag is present (Good) or missing (Error)
  const hasTitle = data.title && data.title.length > 0;
  const hasDesc = data.description && data.description.length > 0;
  const hasImage = data.image && data.image.length > 0;

  return (
    <div className="max-w-5xl mx-auto mt-12 w-full px-4 text-left">
      {/* Status Header */}
      <div className="bg-gray-100 p-4 rounded-lg mb-8 text-sm text-gray-700">
        <span className="font-bold text-gray-900">Scanned URL:</span> {data.url}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Column A: Live Social Preview */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-gray-900">Social Card Preview</h3>
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
            {hasImage ? (
              <img src={data.image} alt="OpenGraph Preview" className="w-full h-56 object-cover border-b border-gray-200" />
            ) : (
              <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                No Image Provided
              </div>
            )}
            <div className="p-4 bg-gray-50">
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                {new URL(data.url).hostname}
              </div>
              <div className="font-bold text-gray-900 text-base truncate mb-1">
                {data.title || "Missing Title"}
              </div>
              <div className="text-gray-600 text-sm line-clamp-2">
                {data.description || "Missing Description. This link will look blank on social media."}
              </div>
            </div>
          </div>
        </div>

        {/* Column B: Technical Data & Status Badges */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-gray-900">Meta Data Analysis</h3>
          <div className="border border-gray-300 rounded-lg bg-white divide-y divide-gray-200 shadow-sm">
            <DataRow label="Page Title (<title>)" value={data.title} isGood={hasTitle} />
            <DataRow label="Meta Description" value={data.description} isGood={hasDesc} />
            <DataRow label="OpenGraph Image (og:image)" value={data.image} isGood={hasImage} />
          </div>
          
          {/* Conditional Warning Panel */}
          {(!hasTitle || !hasDesc || !hasImage) && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              <span className="font-bold block mb-1">Optimization Warning</span>
              Your page is missing critical meta tags. Fix the items marked as "Error" to ensure your website displays correctly on social media and search engines.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ResultsDashboard