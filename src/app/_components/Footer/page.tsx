import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white text-yellow-700 hover:bg-amber-400 hover:text-black p-4 mt-8">
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Your Movie App. All rights reserved.</p>
        <div className="mt-2">
          <a href="https://web.whatsapp.com//contact" className="mx-2 hover:text-gray-400">01203641350 wats app number</a>
        </div>
        <div className="mt-4 flex justify-center space-x-4">
        <a href="/movies" className="mx-2 hover:text-gray-400">الأفلام</a>

          <a href="abanoubsobhy17" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            <FaGithub size={24} />
          </a>
          <a href="linkedin.com/in/abanoub-sobhy-689643289" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            <FaLinkedin size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}