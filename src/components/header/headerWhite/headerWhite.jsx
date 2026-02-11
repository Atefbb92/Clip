import React from 'react'
import logo from "../../../assets/img/logowhite.png";   

const HeaderWhite = () => {
  return (
     <header className="bg-white py-4 transition-all duration-500 z-[1000] sticky top-0 right-0 left-0 fixed-top" data-scrollto-offset="0">
            <div className="flex justify-between items-center px-4">
              <a href="doctor.html">
                <img src={logo} alt="logo" className="h-14" />
              </a>
              <nav id="navbar" className="p-0 relative">
                <ul className="m-0 p-0 flex list-none items-center">
                  <li>
                    <a 
                      className="flex items-center justify-between py-4 px-5 text-base font-normal text-black whitespace-nowrap transition-all duration-300 relative no-underline hover:text-blue-600 before:content-[''] before:absolute before:w-full before:h-0.5 before:bottom-0 before:left-0 before:bg-blue-600 before:invisible before:transition-all before:duration-300 before:transform before:scale-x-0 hover:before:visible hover:before:scale-x-70" 
                      href="#"
                    >
                      À propos
                    </a>
                  </li>
                  <li>
                    <a 
                      className="flex items-center justify-between py-4 px-5 text-base font-normal text-black whitespace-nowrap transition-all duration-300 relative no-underline hover:text-blue-600 before:content-[''] before:absolute before:w-full before:h-0.5 before:bottom-0 before:left-0 before:bg-blue-600 before:invisible before:transition-all before:duration-300 before:transform before:scale-x-0 hover:before:visible hover:before:scale-x-70" 
                      href="#"
                    >
                      Innovation
                    </a>
                  </li>
                  <li>
                    <a 
                      className="flex items-center justify-between py-4 px-5 text-base font-normal text-black whitespace-nowrap transition-all duration-300 relative no-underline hover:text-blue-600 before:content-[''] before:absolute before:w-full before:h-0.5 before:bottom-0 before:left-0 before:bg-blue-600 before:invisible before:transition-all before:duration-300 before:transform before:scale-x-0 hover:before:visible hover:before:scale-x-70" 
                      href="#"
                    >
                      Indications
                    </a>
                  </li>
                  <li>
                    <a 
                      className="flex items-center justify-between py-4 px-5 text-base font-normal text-black whitespace-nowrap transition-all duration-300 relative no-underline hover:text-blue-600 before:content-[''] before:absolute before:w-full before:h-0.5 before:bottom-0 before:left-0 before:bg-blue-600 before:invisible before:transition-all before:duration-300 before:transform before:scale-x-0 hover:before:visible hover:before:scale-x-70" 
                      href="#"
                    >
                      Actu & Events
                    </a>
                  </li>
                  <li>
                    <a 
                      className="flex items-center justify-between py-4 px-5 text-base font-normal text-black whitespace-nowrap transition-all duration-300 relative no-underline hover:text-blue-600 before:content-[''] before:absolute before:w-full before:h-0.5 before:bottom-0 before:left-0 before:bg-blue-600 before:invisible before:transition-all before:duration-300 before:transform before:scale-x-0 hover:before:visible hover:before:scale-x-70" 
                      href="#"
                    >
                      Assistance professionnelle
                    </a>
                  </li>
                </ul>
                <i className="bi bi-list hidden xl:hidden text-gray-800 text-3xl cursor-pointer leading-none transition-all duration-500 fixed top-5 right-5 z-[9999]"></i>
              </nav>
            </div>
          </header>
  )
}

export default HeaderWhite