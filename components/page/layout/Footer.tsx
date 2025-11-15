import {
  Dumbbell,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter
} from 'lucide-react'
import { Button } from '@/components/admin/ui/button'

function Footer() {
  return (
    <>
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-8 h-8 text-primary" />
                <span className="text-xl font-semibold">FitTrack</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Your personal fitness companion for tracking workouts,
                monitoring progress, and achieving goals.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Instagram className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button className="hover:text-primary transition-colors">
                    Features
                  </button>
                </li>
                <li>
                  <button className="hover:text-primary transition-colors">
                    Exercise Library
                  </button>
                </li>
                <li>
                  <button className="hover:text-primary transition-colors">
                    Blog
                  </button>
                </li>
                <li>
                  <button className="hover:text-primary transition-colors">
                    Pricing
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button className="hover:text-primary transition-colors">
                    Blog
                  </button>
                </li>
                <li>
                  <button className="hover:text-primary transition-colors">
                    Workout Guides
                  </button>
                </li>
                <li>
                  <button className="hover:text-primary transition-colors">
                    Nutrition Tips
                  </button>
                </li>
                <li>
                  <button className="hover:text-primary transition-colors">
                    Community
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>fittrack20252910@gmail.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    123 Fitness Street
                    <br />
                    Health City, HC 12345
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 FitTrack. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <button className="hover:text-primary transition-colors">
                Privacy Policy
              </button>
              <button className="hover:text-primary transition-colors">
                Terms of Service
              </button>
              <button className="hover:text-primary transition-colors">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
