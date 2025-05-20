
import { CheckCircle, BarChartBig, Users, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const benefits = [
  {
    icon: <BarChartBig className="h-8 w-8 text-primary" />,
    title: "Boost Productivity",
    description: "Automate repetitive tasks and free up your team to focus on growth and customer satisfaction.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Enhance Customer Loyalty",
    description: "Provide seamless tracking and proactive updates, leading to happier, more loyal customers.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Reduce Operational Costs",
    description: "Optimize inventory and fulfillment processes, significantly cutting down on operational expenses.",
  },
];

export default function WhyChooseSection() {
  return (
    <section id="why-choose-us" className="py-20 md:py-28 bg-slate-100 dark:bg-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">Why SmartOrder is Your Best Choice</h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mt-6 max-w-3xl mx-auto">
            Discover the tangible benefits that make SmartOrder an indispensable tool for modern e-commerce businesses seeking efficiency and scale.
          </p>
        </div>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl shadow-lg hover:shadow-xl dark:hover:shadow-primary/20 transition-shadow duration-300 p-6 flex flex-col items-center text-center md:flex-row md:text-left md:items-start md:space-x-6">
              <div className="flex-shrink-0 mb-4 md:mb-0 p-3 bg-primary/10 dark:bg-primary/20 rounded-full">
                {benefit.icon}
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white mb-2">{benefit.title}</CardTitle>
                <CardContent className="p-0">
                  <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">{benefit.description}</p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-16 text-center">
            <h3 className="text-2xl font-semibold text-slate-800 dark:text-white mb-4">Ready to Transform Your Operations?</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto">
                Join hundreds of businesses leveraging SmartOrder to achieve new heights of e-commerce success.
            </p>
            <a
                href="#contact"
                className="inline-block px-10 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors text-lg"
            >
                Get SmartOrder Today
            </a>
        </div>
      </div>
    </section>
  );
}

