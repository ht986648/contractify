// components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-black text-white py-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo Section */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">Contractify</h2>
        </div>

        {/* Menu Section */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-500 mb-4">Menu</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-yellow-500">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-500">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-500">
                Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-500">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Service Section */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-500 mb-4">
            Service
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-yellow-500">
                Compliance Checks
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-500">
                Document Management
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-500">
                eSigning Solutions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-500">
                Contract Generation
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-10 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
        {/* Copyright */}
        <p className="text-sm text-gray-400">Copyright © 2025</p>

        {/* Terms and Privacy */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="text-sm hover:text-yellow-500">
            Made by 3_ByteSquad
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" aria-label="Facebook">
            <div className="bg-yellow-500 text-black p-2 rounded-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35C.596 0 0 .596 0 1.326v21.348C0 23.404.596 24 1.326 24h11.494v-9.294H9.847v-3.622h2.973V8.413c0-2.937 1.794-4.533 4.414-4.533 1.253 0 2.332.093 2.646.135v3.069h-1.818c-1.424 0-1.699.678-1.699 1.67v2.186h3.391l-.442 3.622h-2.949V24h5.784c.73 0 1.326-.596 1.326-1.326V1.326C24 .596 23.404 0 22.675 0z" />
              </svg>
            </div>
          </a>
          <a href="#" aria-label="Instagram">
            <div className="bg-yellow-500 text-black p-2 rounded-full">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7.75 2h8.5a5.75 5.75 0 0 1 5.75 5.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5zM12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 1.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm4.75-3.25a.875.875 0 1 1 0 1.75.875.875 0 0 1 0-1.75z" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
}
