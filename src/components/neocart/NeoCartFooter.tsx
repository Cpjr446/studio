
import Link from "next/link";
import { Zap } from "lucide-react"; 

export default function NeoCartFooter() {
  return (
    <footer className="bg-slate-800 dark:bg-black text-slate-400 dark:text-slate-500 py-12 md:py-16 border-t dark:border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="bg-primary p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">NeoCart</span>
          </div>
          
          <nav className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 text-sm">
            <Link href="/neocart/smartorder#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="/neocart/smartorder#why-choose-us" className="hover:text-white transition-colors">Why Us</Link>
            <Link href="/neocart/smartorder#contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </nav>

          <div className="text-center md:text-right text-sm">
            &copy; {new Date().getFullYear()} NeoCart Inc. All rights reserved.
            <p className="text-xs mt-1">SmartOrder is a proud product of NeoCart.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

