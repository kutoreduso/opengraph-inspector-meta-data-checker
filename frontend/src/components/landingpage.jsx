import React, { useState } from 'react';
import axios from 'axios';

const LandingPage = () => {

    const [url, setUrl] = useState('')
    const [isloading, setisloading] = useState(false);
    const [result, setResult] = useState(false);
    const [error, SetError] = useState(null);

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
      <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm z-10 sticky top-0">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold tracking-tight">OPENGRAPH</span>
            <span className="text-sm italic text-gray-600">inspector</span>
          </div>
          <nav className="flex gap-6 text-sm font-medium text-gray-700">
            <a href="#about" className="hover:text-black transition-colors">About</a>
            <a href="#github" className="hover:text-black transition-colors">GitHub</a>
          </nav>
        </div>
      </header>

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
              className="bg-[#00d632] hover:bg-green-500 text-black font-bold px-8 py-4 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
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

        {/* Features Grid */}
        <section id="about" className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white/60 p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4 text-xl">🔍</div>
              <h3 className="text-xl font-bold mb-2">Extract Hidden Tags</h3>
              <p className="text-gray-600">Instantly scrape and view title tags, descriptions, and OpenGraph parameters hidden in your website's source code.</p>
            </div>
            <div className="bg-white/60 p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4 text-xl">📱</div>
              <h3 className="text-xl font-bold mb-2">Live Social Previews</h3>
              <p className="text-gray-600">See exactly how your links will render as rich cards on Twitter, Facebook, LinkedIn, and iMessage.</p>
            </div>
            <div className="bg-white/60 p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4 text-xl">⚠️</div>
              <h3 className="text-xl font-bold mb-2">Spot SEO Errors</h3>
              <p className="text-gray-600">Identify missing tags, character count limits, and broken image links to immediately improve your search ranking.</p>
            </div>
          </div>
        </section>

        {/* Recent Scans (Database Proof) */}
        <section className="max-w-4xl mx-auto px-4 py-12 text-center border-t border-gray-100">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Recent Live Scans</h4>
          <div className="flex flex-wrap justify-center gap-4">
            {/* These will eventually be mapped from your Django database state */}
            <span className="px-4 py-2 bg-gray-50 text-gray-600 text-sm rounded-full border border-gray-200">github.com (2m ago)</span>
            <span className="px-4 py-2 bg-gray-50 text-gray-600 text-sm rounded-full border border-gray-200">stripe.com (15m ago)</span>
            <span className="px-4 py-2 bg-gray-50 text-gray-600 text-sm rounded-full border border-gray-200">vercel.com (1h ago)</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-50 border-t border-gray-200 mt-auto py-8 z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div>&copy; 2026 OpenGraph Inspector. Built for CS50.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-black transition-colors">Portfolio</a>
            <a href="#" className="hover:text-black transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
            {/* <header className="p-5">
                <div className="flex items-center justify-center mx-auto ">
                    <div className="flex flex-col">
                        <h1 className="lg:text-[64px] font-bold lg:w-[750px] text-center leading-[105%]">Analyze Your Website's Meta Tags.</h1>

                    </div>
                </div>
            </header> */}
        </>
    )
}
export default LandingPage