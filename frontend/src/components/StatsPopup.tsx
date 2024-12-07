import React, { useEffect, useState } from 'react'
import { X, ShoppingCart, DollarSign, TrendingUp, Utensils, MapPin, Star, MessageSquare } from 'lucide-react'
import axios from 'axios'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Restaurant {
  Restaurant_id: string
  Restaurant_Name: string
  Restaurant_Image: string
  Address: string
  Rating: number
}

interface StatsPopupProps {
  setIsStatsOpen: (value: boolean) => void
  restaurant: Restaurant | null
}

interface Statistics {
  totalOrders: number
  totalEarnings: number
  averageOrdersPerDay: number
  mostPopularItem: string
  review_count: number
}

interface WeeklyRevenue {
  restaurant_id: number
  restaurant_name: string
  week: number
  total_revenue: number
}

export function StatsPopup({ setIsStatsOpen, restaurant }: StatsPopupProps) {
  if (!restaurant) return null

  const [statistics, setStats] = useState<Statistics>({
    totalOrders: 0,
    totalEarnings: 0,
    averageOrdersPerDay: 0,
    mostPopularItem: '',
    review_count: 0,
  })

  const [weeklyRevenueData, setWeeklyRevenueData] = useState<WeeklyRevenue[]>([])
  const [showGraphModal, setShowGraphModal] = useState(false)

  const fetchStats = async () => {
    try {
      const response = await axios.get(`/api/getStats/${restaurant.Restaurant_id}`)
      if (response.status === 200) {
        setStats({
          totalOrders: response.data.stats.average_daily_orders,
          totalEarnings: response.data.stats.weekly_earnings,
          averageOrdersPerDay: response.data.stats.average_orders_per_day,
          mostPopularItem: response.data.stats.most_popular_item,
          review_count: response.data.stats.review_count
        })
      }
    } catch (err) {
      console.log('Error fetching statistics')
    }
  }

  const fetchWeeklyRevenue = async () => {
    try {
      const response = await axios.get(`/api/getWeeklyRevenue/${restaurant.Restaurant_id}`)
      if (response.status === 200) {
        setWeeklyRevenueData(response.data)
      }
    } catch (err) {
      console.log('Error fetching weekly revenue data')
    }
  }

  useEffect(() => {
    fetchStats()
    fetchWeeklyRevenue()

    const intervalId = setInterval(() => {
      fetchStats()
      fetchWeeklyRevenue()
    }, 30000)

    return () => clearInterval(intervalId)
  }, [restaurant.Restaurant_id])

  const stats = [
    { label: 'Avg. Weekly Orders', value: statistics.totalOrders, icon: ShoppingCart },
    { label: 'Weekly Earnings', value: `Rs.${statistics.totalEarnings.toLocaleString()}`, icon: DollarSign },
    { label: 'Avg. Daily Orders', value: statistics.averageOrdersPerDay.toFixed(1), icon: TrendingUp },
    { label: 'Most Popular Item', value: statistics.mostPopularItem, icon: Utensils },
  ]

  const chartData = {
    labels: weeklyRevenueData.map((data) => `Week ${data.week}`),
    datasets: [
      {
        label: 'Weekly Revenue',
        data: weeklyRevenueData.map((data) => data.total_revenue),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-center border-b border-purple-100">
          <h2 className="text-xl sm:text-2xl font-bold text-purple-900 truncate">{restaurant.Restaurant_Name}</h2>
          <button
            onClick={() => setIsStatsOpen(false)}
            className="text-purple-500 hover:text-purple-700 transition-colors duration-200"
            aria-label="Close stats popup"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="w-full sm:w-1/3">
              <img 
                src={restaurant.Restaurant_Image || "/placeholder.svg?height=300&width=300"} 
                alt={restaurant.Restaurant_Name}
                className="w-full h-48 sm:h-full object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="w-full sm:w-2/3 flex flex-col justify-center space-y-3">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-purple-600 mr-2 mt-1 flex-shrink-0" />
                <p className="text-purple-800 text-sm sm:text-base">{restaurant.Address}</p>
              </div>
              <div className="flex items-center space-x-4 my-0">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-1 my-auto" />
                  <p className="text-purple-900 font-semibold my-auto">{restaurant.Rating}</p>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="w-5 h-5 text-purple-600 mr-1  my-auto" />
                  <p className="text-purple-800 text-sm my-auto">{statistics.review_count} reviews</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-purple-50 hover:bg-gradient-to-r from-purple-400 to-indigo-500 rounded-xl p-4 flex items-start space-x-3 transition-all duration-300 hover:bg-purple-100 hover:shadow-md group">
                <div className="bg-purple-200 rounded-full p-2 flex-shrink-0 group-hover:bg-purple-300 transition-colors duration-300">
                  <stat.icon className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <p className="text-xs font-medium text-purple-600 mb-1">{stat.label}</p>
                  <p className="text-sm font-bold text-purple-900">{stat.value}</p>
                </div>
              </div>
            ))}

            {/* Button to open the graph modal */}
            <div className="bg-purple-50 rounded-xl p-4 flex items-center justify-between space-x-3 transition-all duration-300 hover:bg-purple-100 hover:shadow-md">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-purple-700" />
                <p className="text-sm font-bold text-purple-900">Weekly Revenue</p>
              </div>
              <button
                className="text-purple-600 hover:text-purple-800 font-semibold"
                onClick={() => setShowGraphModal(true)} // Open the graph modal
              >
                View Graph
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Graph Modal */}
      {showGraphModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-4 py-3 sm:px-6 sm:py-4 border-b border-purple-100">
              <h2 className="text-xl sm:text-2xl font-bold text-purple-900">Weekly Revenue Graph</h2>
              <button
                onClick={() => setShowGraphModal(false)} // Close the graph modal
                className="text-purple-500 hover:text-purple-700 transition-colors duration-200"
                aria-label="Close graph modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {Array.isArray(weeklyRevenueData) && weeklyRevenueData.length > 0 ? (
                <Bar data={chartData} options={{ responsive: true }} />
              ) : (
                <p>Loading weekly revenue data...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
