
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, PackageSearch, Users } from 'lucide-react';

const features = [
  {
    icon: <PackageSearch className="h-10 w-10 text-primary mb-4" />,
    title: 'Real-time Order Tracking',
    description: 'Keep your customers informed with up-to-the-minute tracking information, from processing to delivery.',
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-primary mb-4" />,
    title: 'Smart Inventory Alerts',
    description: 'Avoid stockouts and overstocking with intelligent alerts that help you maintain optimal inventory levels.',
  },
  {
    icon: <Users className="h-10 w-10 text-primary mb-4" />,
    title: 'Seamless CRM Integration',
    description: 'Connect SmartOrder with your existing CRM to centralize customer data and streamline communication.',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Why Choose SmartOrder?</h2>
          <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
            Empower your e-commerce operations with features built for growth and efficiency.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 bg-slate-50">
              <CardHeader>
                <div className="flex justify-center">{feature.icon}</div>
                <CardTitle className="text-xl font-semibold text-slate-800">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
