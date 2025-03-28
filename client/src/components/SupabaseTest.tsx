import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface BookSummary {
  id: string
  title: string
  author: string
  description: string
  category: string
  read_time: string
}

interface BusinessPlan {
  id: string
  title: string
  industry: string
  description: string
  author: string
  read_time: string
  price: number
}

export default function SupabaseTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [books, setBooks] = useState<BookSummary[]>([])
  const [businessPlans, setBusinessPlans] = useState<BusinessPlan[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch book summaries
        const { data: booksData, error: booksError } = await supabase
          .from('book_summaries')
          .select('*')
        
        if (booksError) throw booksError

        // Fetch business plans
        const { data: plansData, error: plansError } = await supabase
          .from('business_plans')
          .select('*')
        
        if (plansError) throw plansError
        
        setBooks(booksData || [])
        setBusinessPlans(plansData || [])
        setStatus('success')
      } catch (err) {
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-8 text-white">Supabase Connection Test</h2>
        
        {status === 'loading' && (
          <div className="text-gray-400">Loading data...</div>
        )}
        
        {status === 'error' && (
          <div className="text-red-500">
            <p>Error loading data:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="space-y-12">
            {/* Book Summaries Section */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">Book Summaries</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {books.length === 0 ? (
                  <p className="text-gray-400">No book summaries found.</p>
                ) : (
                  books.map(book => (
                    <div 
                      key={book.id} 
                      className="bg-gray-800 rounded-lg p-6 shadow-lg hover:bg-gray-700 transition-colors"
                    >
                      <h3 className="text-xl font-semibold text-white mb-2">{book.title}</h3>
                      <p className="text-gray-400 text-sm mb-1">by {book.author}</p>
                      <p className="text-gray-400 text-sm mb-3">{book.read_time} • {book.category}</p>
                      <p className="text-gray-300">{book.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Business Plans Section */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">Business Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {businessPlans.length === 0 ? (
                  <p className="text-gray-400">No business plans found.</p>
                ) : (
                  businessPlans.map(plan => (
                    <div 
                      key={plan.id} 
                      className="bg-gray-800 rounded-lg p-6 shadow-lg hover:bg-gray-700 transition-colors"
                    >
                      <h3 className="text-xl font-semibold text-white mb-2">{plan.title}</h3>
                      <p className="text-gray-400 text-sm mb-1">by {plan.author}</p>
                      <p className="text-gray-400 text-sm mb-3">{plan.read_time} • {plan.industry}</p>
                      <p className="text-gray-300 mb-3">{plan.description}</p>
                      <p className="text-emerald-400 text-sm font-medium">Price: ${plan.price}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 