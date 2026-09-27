const FooterSection = () => {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 mt-auto py-8 z-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500">
        <div className="text-center md:text-left">
          &copy; 2026 OpenGraph Inspector by Kurt Cantiga.
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <a href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-gray-900 transition-colors">Terms of Use</a>
          <a href="/cookies" className="hover:text-gray-900 transition-colors">Cookie Policy</a>
        </div>

        <div className="flex gap-6">
          <a href="https://by-kurt.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">Portfolio</a>
          <a href="#" className="hover:text-gray-900 transition-colors">LinkedIn</a>
        </div>

      </div>
    </footer>
  );
}

export default FooterSection;