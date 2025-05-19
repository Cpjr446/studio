
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Streamline Your E-commerce with <span className="text-primary">SmartOrder</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            SmartOrder is the intelligent e-commerce plugin designed to help businesses like yours manage, fulfill, and track online orders with unparalleled efficiency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg">
              <Link href="#contact">Request a Demo</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 shadow-lg">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
        <div>
          <Image
            src="https://placehold.co/600x400.png" // Replace with a relevant image
            alt="SmartOrder Dashboard Mockup"
            width={600}
            height={400}
            className="rounded-lg shadow-xl mx-auto"
            data-ai-hint="dashboard interface"
          />
        </div>
      </div>
    </section>
  );
}
