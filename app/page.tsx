import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Hammer, Wrench, Briefcase, Truck, Paintbrush, HardHat } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Connecting Skilled Workers with <span className="text-blue-600">Local Jobs</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Find work or hire trusted local professionals — fast and simple. No complications, just results.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/login?role=worker" className="w-full sm:w-auto">
                <Button size="lg" className="w-full text-lg h-12">
                  Find Work <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/login?role=recruiter" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full text-lg h-12">
                  Post a Job
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-gray-50 dark:bg-zinc-900">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Hammer, label: "Carpenter" },
              { icon: Wrench, label: "Plumber" },
              { icon: Briefcase, label: "Helper" },
              { icon: Truck, label: "Driver" },
              { icon: Paintbrush, label: "Painter" },
              { icon: HardHat, label: "Construction" },
              { icon: Wrench, label: "Mechanic" },
              { icon: Briefcase, label: "Maid" },
            ].map((cat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-zinc-700">
                <cat.icon className="h-10 w-10 text-blue-600 mb-4" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">1</div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Create Profile</h3>
              <p className="text-gray-600 dark:text-gray-400">Sign up as a worker or recruiter in seconds.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">2</div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Post or Apply</h3>
              <p className="text-gray-600 dark:text-gray-400">Post jobs or browse listings in your area.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">3</div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Get Matched</h3>
              <p className="text-gray-600 dark:text-gray-400">Connect instantly and get the work done.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t bg-gray-50 dark:bg-zinc-950 dark:border-zinc-800">
        <div className="container px-4 mx-auto flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>© 2025 WorkConnect. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-blue-600">About</Link>
            <Link href="#" className="hover:text-blue-600">Contact</Link>
            <Link href="#" className="hover:text-blue-600">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
