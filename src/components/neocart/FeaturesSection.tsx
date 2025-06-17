
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PackageSearch, Zap, Users } from 'lucide-react'; // Removed BarChart3 as it wasn't used

const features = [
  {
    icon: <PackageSearch className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />,
    title: 'Real-time Order Tracking',
    description: 'Empower your customers with precise, up-to-the-minute tracking, from warehouse to doorstep, enhancing transparency and trust.',
  },
  {
    icon: <Zap className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />,
    title: 'Smart Inventory Alerts',
    description: 'Proactively manage stock levels with intelligent alerts, preventing stockouts and minimizing overstock for optimal capital efficiency.',
  },
  {
    icon: <Users className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />,
    title: 'Seamless CRM Integration',
    description: 'Synchronize SmartOrder effortlessly with your CRM, creating a unified customer view and streamlining communication pathways.',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28 bg-[hsl(var(--background))] dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">Unlock Peak E-commerce Efficiency</h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mt-6 max-w-3xl mx-auto">
            SmartOrder equips your business with cutting-edge tools designed for robust growth, streamlined operations, and superior customer experiences.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature) => (
            <Card key={feature.title} className="group text-center bg-card dark:bg-dark-card dark:border-slate-700 rounded-xl shadow-lg hover:shadow-2xl dark:hover:shadow-primary/20 transition-all duration-300 ease-in-out transform hover:-translate-y-2 p-6 md:p-8">
              <CardHeader className="items-center pb-4">
                <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-full mb-4">
                  {feature.icon} {/* Icon color is text-primary, which should adapt if primary changes in dark mode, or use a specific dark mode icon color if needed */}
                </div>
                <CardTitle className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

