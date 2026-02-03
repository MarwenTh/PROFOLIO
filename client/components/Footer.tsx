import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full py-12 bg-neutral-50 dark:bg-black border-t border-neutral-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        
        <div className="flex items-center gap-2">
             <Image 
                src="/assets/logo2.png" 
                alt="PROFOLIO" 
                width={24} 
                height={24} 
                className="object-contain opacity-80"
             />
             <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">PROFOLIO</span>
        </div>

        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          © {new Date().getFullYear()} PROFOLIO build. All rights reserved.
        </div>

        <div className="flex gap-6">
             <Link href="#" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">Twitter</Link>
             <Link href="#" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">GitHub</Link>
             <Link href="#" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">LinkedIn</Link>
        </div>

      </div>
    </footer>
  );
};
