import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Smart Restaurant Ordering System
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Experience seamless dining with our innovative ordering system. Scan, order, and enjoy!
          </p>
          <div className="space-x-4">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Easy Ordering</h3>
              <p className="text-gray-600">
                Scan QR code, browse menu, and place orders with just a few taps.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Real-time Updates</h3>
              <p className="text-gray-600">
                Track your order status in real-time from preparation to serving.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Digital Payments</h3>
              <p className="text-gray-600">
                Secure and convenient payment options for a hassle-free experience.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 