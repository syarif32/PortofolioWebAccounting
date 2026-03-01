import { Github, Linkedin, Mail } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-950 text-gray-400 py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-sm font-semibold text-white mb-1">
            Portfolio<span className="text-gray-500">.</span>
          </p>
          <p className="text-xs">
            Accounting Student · Financial Report · Tax & Audit
          </p>
        </div>
        
        <p className="text-xs text-center">
          © {currentYear} All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <a
            href="#contact"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Mail className="w-4 h-4" />
          </a>
          <a
            href="#"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="#"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}