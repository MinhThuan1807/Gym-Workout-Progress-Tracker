import { useRouter } from 'next/navigation'
import { Dumbbell } from 'lucide-react'
import { Button } from '@/components/ui/button'

function Header() {
  const router = useRouter()

  return (
    <>
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-8 h-8 text-primary" />
              <span className="text-xl font-semibold">FitTrack</span>
            </div>

            {/* Navigation */}
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

            <Button
              onClick={() => router.push('/user/login')}
              variant="outline"
            >
              Login
            </Button>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
