
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section id="hero" className="bg-gradient-to-br from-slate-50 to-sky-100 py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            Revolutionize Your E-commerce with <span className="text-primary">SmartOrder</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl md:max-w-none mx-auto md:mx-0">
            SmartOrder is the intelligent plugin empowering businesses to effortlessly manage, fulfill, and track online orders, boosting efficiency and customer satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg px-8 py-3 text-base">
              <Link href="#contact">Request a Demo</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5 hover:border-primary/80 font-semibold shadow-lg px-8 py-3 text-base">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
        <div className="mt-12 md:mt-0">
          <Image
            src="https://placehold.co/700x500.png" 
            alt="SmartOrder Dashboard Interface Mockup"
            width={700}
            height={500}
            className="rounded-xl shadow-2xl mx-auto transform transition-all duration-500 hover:scale-105"
            data-ai-hint="ecommerce dashboard analytics"
            priority
          />
        </div>
      </div>
    </section>
  );
}
