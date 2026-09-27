import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResultsDashboard from './result';


const LandingPage = () => {
    const [recentScans, setRecentScans] = useState([]);
    const [url, setUrl] = useState('');
    const [isloading, setisloading] = useState(false);
    const [results, setResult] = useState(false);
    const [error, SetError] = useState(null);

    const fetchRecent = async () => {
      try {
          const res = await axios.get('https://localhost:8000/api/recent/');
          setRecentScans(res.data)
      } catch (err) {
          console.error("Failed to load recent scans")
      }
    }

    useEffect(() => {
      fetchRecent();
    }, []);

    const handleAnalyze = async (e) =>{
        e.preventDefault();
        if (!url) return;

        setisloading(true);
        SetError(null);
        setResult(null);
    
        try {
            const response = await axios.post('http://localhost:8000/api/analyze/', {
                url: url
            })


            setResult(response.data)
            console.log("backend returned", response.data)
        } catch (err) { 
            console.error(err);
            setError("Failed to analyze URL. make sure the backend are connected")
        } finally {
            setisloading(false)
        }
    }
    return (
        <>
        <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden flex flex-col">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-gray-200 blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-gray-200 blur-3xl opacity-50 pointer-events-none"></div>

      {/* Header Navigation */}
      

      {/* Main Content Area */}
      <main className="flex-grow z-10">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-4 pt-24 pb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-black mb-6">
            Analyze Your Website's<br />Meta Tags.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-medium">
            Scan any web page to check your SEO data and ensure your site is optimized for search engines and social sharing.
          </p>

          {/* Search Form */}
          <form onSubmit={handleAnalyze} className="max-w-2xl mx-auto flex shadow-lg rounded-lg overflow-hidden border border-gray-300 bg-white">
            <input
              type="url"
              placeholder="https://example.com"
              className="flex-grow px-6 py-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={isloading}
              className="bg-[#00d632] hover:bg-green-500 cursor-pointer text-black font-bold px-8 py-4 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
            >
              {isloading ? (
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Analyze"
              )}
            </button>
          </form>
        </section>

        <section id="about" className="max-w-6xl mx-auto px-4 py-16">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
    
    {/* Card 1: Extract */}
    <div className="bg-white/60 p-6 rounded-xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
      <div className="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">Extract Hidden Tags</h3>
      <p className="text-gray-600 leading-relaxed">Instantly scrape and view title tags, descriptions, and OpenGraph parameters hidden in your website's source code.</p>
    </div>

    {/* Card 2: Previews */}
    <div className="bg-white/60 p-6 rounded-xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
      <div className="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">Live Social Previews</h3>
      <p className="text-gray-600 leading-relaxed">See exactly how your links will render as rich cards on Twitter, Facebook, LinkedIn, and iMessage.</p>
    </div>

    {/* Card 3: Errors */}
    <div className="bg-white/60 p-6 rounded-xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
      <div className="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">Spot SEO Errors</h3>
      <p className="text-gray-600 leading-relaxed">Identify missing tags, character count limits, and broken image links to immediately improve your search ranking.</p>
    </div>

  </div>
</section>

        {/* Recent Scans (Database Proof) */}
        <section className="max-w-4xl mx-auto px-4 py-12 text-center border-t border-gray-100">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Recent Live Scans</h4>
          <div className="flex flex-wrap justify-center gap-4">
           {recentScans.length > 0 ? (
              recentScans.map((scan, index) => (
                <button
                  key={index}
                  onClick={() => setUrl(scan.url)} // Clicking sets the URL in the search bar
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 shadow-sm hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors"
                >
                  {/* Extracts just the domain name (e.g., example.com) for a cleaner look */}
                  {new URL(scan.url).hostname}
                </button>
              ))
            ) : (
              <span className="text-gray-400 text-sm">No recent scans available.</span>
            )}
          </div>
        </section>
      {results ? (
          <ResultsDashboard data={results} />
        ) : (
          <>
            {/* Features Grid */}
            <section id="about" className="max-w-6xl mx-auto px-4 py-16">
              {/* ... your 3 columns ... */}
            </section>

            {/* Recent Scans (Database Proof) */}
            <section className="max-w-4xl mx-auto px-4 py-12 text-center border-t border-gray-100">
               {/* ... your recent scans ... */}
            </section>
          </>
        )}
      </main>
    </div>
            {/* <header className="p-5">
                <div className="flex items-center justify-center mx-auto ">
                    <div className="flex flex-col">
                        <h1 className="lg:text-[64px] font-bold lg:w-[750px] text-center leading-[105%]">Analyze Your Website's Meta Tags.</h1>

                    </div>
                </div>
            </header> */
                
            }
            {/* Render results when they exist, or show features grid if empty */}
{/* Render results when they exist, or show features grid if empty */}

        </>
    )
}
export default LandingPage