

const NavbarSection = () => {
    return(
        <>
            <header className="z-99 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm z-10 sticky top-0">
        <div className="mx-auto px-4 h-16 flex items-center justify-between">
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
        </>
    )

}
export default NavbarSection
