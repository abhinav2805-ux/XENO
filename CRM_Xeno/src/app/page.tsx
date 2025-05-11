import Link from "next/link"
import { ArrowRight, BarChart3, Users, Calendar, MessageSquare, PieChart, Layers, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/5 -z-10" />
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              Welcome to Xeno CRM
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              The comprehensive customer relationship management solution for modern businesses. Streamline your
              workflow, enhance customer engagement, and boost your sales.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
             
              <Button asChild size="lg" variant="default" className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-48 left-0 right-0 h-72 bg-gradient-to-b from-transparent to-white/20 backdrop-blur-sm -z-10 transform -skew-y-3" />
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Features for Your Business</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Everything you need to manage customer relationships, track sales, and grow your business.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <CardTitle>Customer Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Organize all your customer information in one place. Track interactions and manage relationships
                effectively.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="text-emerald-600 p-0 hover:text-emerald-700 hover:bg-transparent">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Campaign Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Create, monitor, and optimize your marketing campaigns with powerful analytics and reporting tools.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="text-purple-600 p-0 hover:text-purple-700 hover:bg-transparent">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                <PieChart className="h-6 w-6 text-amber-600" />
              </div>
              <CardTitle>Sales Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Visualize your sales process from lead to close. Identify bottlenecks and improve conversion rates.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="text-amber-600 p-0 hover:text-amber-700 hover:bg-transparent">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Intuitive Dashboard Experience</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Get a complete overview of your business with our customizable dashboards.
            </p>
          </div>

          <Tabs defaultValue="sales" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="sales">Sales Dashboard</TabsTrigger>
              <TabsTrigger value="customers">Customer Insights</TabsTrigger>
              <TabsTrigger value="marketing">Marketing Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="sales" className="border rounded-lg p-6 bg-white shadow-lg">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium">Sales Overview</h3>
                  <div className="text-sm text-slate-500">Last 30 days</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total Revenue</CardDescription>
                      <CardTitle className="text-2xl">$24,780</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-emerald-500">↑ 12% from last month</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>New Deals</CardDescription>
                      <CardTitle className="text-2xl">48</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-emerald-500">↑ 4% from last month</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Conversion Rate</CardDescription>
                      <CardTitle className="text-2xl">18.2%</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-red-500">↓ 2% from last month</div>
                    </CardContent>
                  </Card>
                </div>
                <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center">
                  <p className="text-slate-400">Sales trend chart visualization</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="customers" className="border rounded-lg p-6 bg-white shadow-lg">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium">Customer Insights</h3>
                  <div className="text-sm text-slate-500">Last 30 days</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total Customers</CardDescription>
                      <CardTitle className="text-2xl">1,248</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-emerald-500">↑ 8% from last month</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>New Customers</CardDescription>
                      <CardTitle className="text-2xl">64</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-emerald-500">↑ 16% from last month</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Customer Retention</CardDescription>
                      <CardTitle className="text-2xl">92.4%</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-emerald-500">↑ 3% from last month</div>
                    </CardContent>
                  </Card>
                </div>
                <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center">
                  <p className="text-slate-400">Customer demographics visualization</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="marketing" className="border rounded-lg p-6 bg-white shadow-lg">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium">Marketing Analytics</h3>
                  <div className="text-sm text-slate-500">Last 30 days</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Campaign ROI</CardDescription>
                      <CardTitle className="text-2xl">324%</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-emerald-500">↑ 28% from last month</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Lead Generation</CardDescription>
                      <CardTitle className="text-2xl">186</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-emerald-500">↑ 12% from last month</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Email Open Rate</CardDescription>
                      <CardTitle className="text-2xl">28.6%</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-red-500">↓ 4% from last month</div>
                    </CardContent>
                  </Card>
                </div>
                <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center">
                  <p className="text-slate-400">Marketing campaign performance visualization</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">More Powerful Features</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Discover all the tools you need to grow your business and delight your customers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow hover:shadow-md transition-all duration-300">
            <CardHeader>
              <Calendar className="h-8 w-8 text-slate-700 mb-2" />
              <CardTitle className="text-lg">Appointment Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">Easily schedule and manage appointments with your customers.</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow hover:shadow-md transition-all duration-300">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-slate-700 mb-2" />
              <CardTitle className="text-lg">Integrated Messaging</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">Communicate with your team and customers in one platform.</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow hover:shadow-md transition-all duration-300">
            <CardHeader>
              <Layers className="h-8 w-8 text-slate-700 mb-2" />
              <CardTitle className="text-lg">Document Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">Store and organize all your important documents securely.</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow hover:shadow-md transition-all duration-300">
            <CardHeader>
              <Shield className="h-8 w-8 text-slate-700 mb-2" />
              <CardTitle className="text-lg">Advanced Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">Keep your data safe with enterprise-grade security features.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Businesses Worldwide</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">See what our customers are saying about Xeno CRM.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                  <div>
                    <CardTitle className="text-lg">Sarah Johnson</CardTitle>
                    <CardDescription>Marketing Director, TechCorp</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  "Xeno CRM has transformed how we manage our customer relationships. The intuitive interface and
                  powerful features have helped us increase our sales by 35%."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                  <div>
                    <CardTitle className="text-lg">Michael Chen</CardTitle>
                    <CardDescription>CEO, GrowthWave</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  "The analytics and reporting features in Xeno CRM give us insights we never had before. It's like
                  having a business intelligence team built into our CRM."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                  <div>
                    <CardTitle className="text-lg">Emily Rodriguez</CardTitle>
                    <CardDescription>Sales Manager, RetailPlus</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  "Our sales team loves the pipeline visualization and automation features. Onboarding was smooth, and
                  the support team has been exceptional."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your business?</h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-10">
            Join thousands of businesses that use Xeno CRM to streamline operations, improve customer relationships, and
            drive growth.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/signup">Start Your Free Trial</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-black border-white hover:bg-white/10">
              <Link href="/demo">
                Request a Demo <Zap className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="text-slate-400 mt-6 text-sm">No credit card required. 14-day free trial.</p>
        </div>
      </section>
    </div>
  )
}
