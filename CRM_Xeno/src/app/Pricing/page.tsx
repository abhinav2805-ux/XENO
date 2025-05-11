import Link from "next/link"
import { Check, HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Choose the perfect plan for your business needs. No hidden fees, no surprises.
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <Tabs defaultValue="monthly" className="w-[300px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annually">
                  Annually
                  <Badge variant="outline" className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200">
                    Save 20%
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white relative">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl">Starter</CardTitle>
                <CardDescription className="text-slate-500 mt-2">
                  Perfect for small businesses and startups
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-slate-500 ml-2">/ month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Up to 1,000 contacts</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Basic CRM features</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Email integration</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Mobile app access</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>5 team members</span>
                  </li>
                  <li className="flex items-start text-slate-400">
                    <X className="h-5 w-5 text-slate-300 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-start text-slate-400">
                    <X className="h-5 w-5 text-slate-300 mr-2 mt-0.5 flex-shrink-0" />
                    <span>API access</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-slate-900 hover:bg-slate-800">
                  <Link href="/signup?plan=starter">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Professional Plan */}
            <Card className="border-none shadow-xl bg-white relative md:scale-105 z-10">
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <Badge className="bg-emerald-600 hover:bg-emerald-600">Most Popular</Badge>
              </div>
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl">Professional</CardTitle>
                <CardDescription className="text-slate-500 mt-2">Ideal for growing businesses</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$79</span>
                  <span className="text-slate-500 ml-2">/ month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Up to 10,000 contacts</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Advanced CRM features</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Email & SMS integration</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Mobile app access</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>15 team members</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-start text-slate-400">
                    <X className="h-5 w-5 text-slate-300 mr-2 mt-0.5 flex-shrink-0" />
                    <span>API access</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/signup?plan=professional">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white relative">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <CardDescription className="text-slate-500 mt-2">
                  For large organizations with complex needs
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$199</span>
                  <span className="text-slate-500 ml-2">/ month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Unlimited contacts</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>All CRM features</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>All integrations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Mobile app access</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Unlimited team members</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Advanced analytics & reporting</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>API access & custom development</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-slate-900 hover:bg-slate-800">
                  <Link href="/signup?plan=enterprise">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Compare Plans</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Find the perfect plan for your business needs with our detailed feature comparison.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full max-w-5xl mx-auto border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-4 px-6 text-left font-medium text-slate-500">Features</th>
                  <th className="py-4 px-6 text-center font-medium text-slate-500">Starter</th>
                  <th className="py-4 px-6 text-center font-medium text-slate-500">Professional</th>
                  <th className="py-4 px-6 text-center font-medium text-slate-500">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-6 text-left font-medium">Contacts</td>
                  <td className="py-4 px-6 text-center">1,000</td>
                  <td className="py-4 px-6 text-center">10,000</td>
                  <td className="py-4 px-6 text-center">Unlimited</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-6 text-left font-medium">Team Members</td>
                  <td className="py-4 px-6 text-center">5</td>
                  <td className="py-4 px-6 text-center">15</td>
                  <td className="py-4 px-6 text-center">Unlimited</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-6 text-left font-medium">
                    <div className="flex items-center">
                      <span>Lead Scoring</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-slate-400 ml-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px] text-xs">
                              Automatically score leads based on their engagement and behavior
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <X className="h-5 w-5 text-slate-300 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Check className="h-5 w-5 text-emerald-500 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Check className="h-5 w-5 text-emerald-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-6 text-left font-medium">Email Campaigns</td>
                  <td className="py-4 px-6 text-center">Basic</td>
                  <td className="py-4 px-6 text-center">Advanced</td>
                  <td className="py-4 px-6 text-center">Advanced</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-6 text-left font-medium">SMS Integration</td>
                  <td className="py-4 px-6 text-center">
                    <X className="h-5 w-5 text-slate-300 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Check className="h-5 w-5 text-emerald-500 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Check className="h-5 w-5 text-emerald-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-6 text-left font-medium">Analytics & Reporting</td>
                  <td className="py-4 px-6 text-center">Basic</td>
                  <td className="py-4 px-6 text-center">Advanced</td>
                  <td className="py-4 px-6 text-center">Custom</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-6 text-left font-medium">API Access</td>
                  <td className="py-4 px-6 text-center">
                    <X className="h-5 w-5 text-slate-300 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <X className="h-5 w-5 text-slate-300 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Check className="h-5 w-5 text-emerald-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-6 text-left font-medium">Dedicated Support</td>
                  <td className="py-4 px-6 text-center">Email</td>
                  <td className="py-4 px-6 text-center">Email & Chat</td>
                  <td className="py-4 px-6 text-center">24/7 Priority</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-6 text-left font-medium">Custom Branding</td>
                  <td className="py-4 px-6 text-center">
                    <X className="h-5 w-5 text-slate-300 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">Limited</td>
                  <td className="py-4 px-6 text-center">Full</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Businesses Worldwide</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have transformed their business with Xeno CRM.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-white border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                  <div>
                    <CardTitle className="text-lg">Robert Thompson</CardTitle>
                    <CardDescription>CEO, TechInnovate</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  "We switched to Xeno CRM's Professional plan and saw a 40% increase in our sales team's productivity.
                  The analytics tools have been game-changing for our business strategy."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                  <div>
                    <CardTitle className="text-lg">Jennifer Lee</CardTitle>
                    <CardDescription>Marketing Director, GrowthWave</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  "The Enterprise plan has given us the flexibility we needed to customize the CRM to our specific
                  industry requirements. The unlimited contacts feature is perfect for our large client base."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                  <div>
                    <CardTitle className="text-lg">David Martinez</CardTitle>
                    <CardDescription>Small Business Owner</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  "As a small business, the Starter plan was perfect for us. It had all the features we needed without
                  breaking the bank. The mobile app lets me manage my customer relationships on the go."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Find answers to common questions about our pricing and features.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">Can I upgrade or downgrade my plan later?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can upgrade or downgrade your plan at any time. When you upgrade, the new features will be
                  immediately available, and we'll prorate your billing. If you downgrade, the changes will take effect
                  at the start of your next billing cycle.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">Is there a free trial available?</AccordionTrigger>
                <AccordionContent>
                  Yes, we offer a 14-day free trial on all our plans. No credit card is required to start your trial.
                  You'll have full access to all the features included in your selected plan during the trial period.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">What happens if I exceed my contact limit?</AccordionTrigger>
                <AccordionContent>
                  If you approach your contact limit, we'll notify you so you can either upgrade to a higher plan or
                  manage your contacts. We won't automatically charge you for overages, and your existing contacts will
                  remain accessible.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  Do you offer discounts for non-profits or educational institutions?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, we offer special pricing for non-profit organizations and educational institutions. Please
                  contact our sales team for more information about our discount programs and eligibility requirements.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">Can I cancel my subscription at any time?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can cancel your subscription at any time. If you cancel, you'll still have access to your
                  plan until the end of your current billing cycle. We don't offer refunds for partial months of
                  service.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left">Is my data secure with Xeno CRM?</AccordionTrigger>
                <AccordionContent>
                  Absolutely. We take data security very seriously. Xeno CRM uses industry-standard encryption, regular
                  security audits, and strict access controls to protect your data. We are GDPR compliant and offer data
                  processing agreements for Enterprise customers.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started with Xeno CRM?</h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-10">
            Choose the plan that's right for your business and start managing your customer relationships more
            effectively today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/signup">Start Your Free Trial</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-black border-white hover:bg-white/10">
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
          <p className="text-slate-400 mt-6 text-sm">No credit card required. 14-day free trial on all plans.</p>
        </div>
      </section>
    </div>
  )
}
