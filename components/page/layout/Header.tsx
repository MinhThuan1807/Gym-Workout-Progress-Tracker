import { useRouter } from 'next/navigation'
import { Dumbbell, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Link from 'next/link'

function Header() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMobileMenuOpen(false) // Close mobile menu after navigation
  }

  return (
    <>
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href='/'>
             <div  className="flex items-center gap-2 cursor-pointer">
                  <Dumbbell className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  <span className="text-lg sm:text-xl font-semibold">FitTrack</span>
             </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => router.push('/')}
                className="text-sm hover:text-primary transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => router.push('/library-exercises')}
                className="text-sm hover:text-primary transition-colors"
              >
                Exercises
              </button>
              <button
                onClick={() => router.push('/blogs')}
                className="text-sm hover:text-primary transition-colors"
              >
                Blog
              </button>
            </nav>

            {/* Desktop Login Button */}
            <Button
              onClick={() => router.push('/user/login')}
              variant="outline"
              className="hidden md:flex"
            >
              Login
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4">
              <nav className="flex flex-col space-y-4">
                <button
                  onClick={() => handleNavigation('/')}
                  className="text-left text-sm hover:text-primary transition-colors py-2"
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigation('/library-exercises')}
                  className="text-left text-sm hover:text-primary transition-colors py-2"
                >
                  Exercises
                </button>
                <button
                  onClick={() => handleNavigation('/blogs')}
                  className="text-left text-sm hover:text-primary transition-colors py-2"
                >
                  Blog
                </button>
                <Button
                  onClick={() => handleNavigation('/user/login')}
                  variant="outline"
                  className="w-full mt-4"
                >
                  Login
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
}

export default Header
