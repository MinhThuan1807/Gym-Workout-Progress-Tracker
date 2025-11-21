'use client'

import { Button } from '@/components/admin/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/user/page/layout/Header'
import Footer from '@/components/user/page/layout/Footer'
import { useRouter } from 'next/navigation'

const LandingPage = () => {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-sm">Your Personal Fitness Companion</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Track Your Workout,
              <br />
              <span className="text-primary">Reach Your Goal</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-lg">
              Transform your fitness journey with smart tracking, detailed
              analytics, and personalized insights. Every rep counts, every goal
              matters.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/user/register" className="flex">
                <Button
                  size="lg"
                  onClick={() => router.push('/dashboard')}
                  className="text-lg h-14 px-8 rounded-2xl shadow-lg shadow-primary/20 cursor-pointer"
                >
                  Get Started
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="text-lg h-14 px-8 rounded-2xl cursor-pointer"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div>
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">
                  Active Users
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">1M+</div>
                <div className="text-sm text-muted-foreground">
                  Workouts Logged
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">
                  Goal Success
                </div>
              </div>
            </div>
          </div>
          {/* Right Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl blur-3xl"></div>
            <Image
              src="/a1.jpg"
              alt="Person working out"
              className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              width={500}
              height={500}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
          Everything You Need to Succeed
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Track Workouts',
              description:
                'Log exercises, sets, reps, and weights with ease. Never forget a workout again.',
              icon: '📊'
            },
            {
              title: 'Monitor Progress',
              description:
                'Visualize your strength gains and body composition changes over time.',
              icon: '📈'
            },
            {
              title: 'Exercise Library',
              description:
                'Access hundreds of exercises with detailed instructions and muscle groups.',
              icon: '💪'
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  )
}
export default LandingPage
