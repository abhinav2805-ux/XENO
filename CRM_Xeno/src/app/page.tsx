// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-20">
        <h1 className="text-5xl font-bold mb-6">Welcome to Xeno CRM</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          The comprehensive customer relationship management solution for modern businesses.
          Streamline your workflow, enhance customer engagement, and boost your sales.
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/signin" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
          >
            Sign In
          </Link>
          <Link 
            href="/signup" 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium"
          >
            Get Started
          </Link>
        </div>
      </section>
      
      <section className="grid md:grid-cols-3 gap-8 mb-20">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Customer Management</h2>
          <p>Organize all your customer information in one place. Track interactions and manage relationships effectively.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Campaign Tracking</h2>
          <p>Create, monitor, and optimize your marketing campaigns with powerful analytics and reporting tools.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Sales Pipeline</h2>
          <p>Visualize your sales process from lead to close. Identify bottlenecks and improve conversion rates.</p>
        </div>
      </section>
      
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to transform your business?</h2>
        <Link 
          href="/signup" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-md font-medium text-lg"
        >
          Start Your Free Trial
        </Link>
      </section>
    </div>
  );
}