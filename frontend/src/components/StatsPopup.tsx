import React, { useEffect, useState } from 'react'
import { X, BarChart, ShoppingCart, DollarSign, TrendingUp, Utensils, MapPin, Star, MessageSquare } from 'lucide-react'
import axios from 'axios'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, ChartOptions, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js'

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
    { label: 'Earnings this week', value: `Rs.${statistics.totalEarnings.toLocaleString()}`, icon: DollarSign },
    { label: 'Avg. Daily Orders', value: statistics.averageOrdersPerDay.toFixed(1), icon: TrendingUp },
    { label: 'Most Popular Item', value: statistics.mostPopularItem, icon: Utensils },
  ]

  const formatWeekToRange = (week: number): string => {
    const baseDate = new Date('2024-01-01')
    const startOfWeek = new Date(baseDate.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000)
    const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000)

    const formatOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }

    const formattedStart = startOfWeek.toLocaleDateString('en-US', formatOptions)
    const formattedEnd = endOfWeek.toLocaleDateString('en-US', formatOptions)

    return `${formattedStart}-${formattedEnd}`
  }

  const formattedLabels = weeklyRevenueData.map((data) => formatWeekToRange(data.week))

  const chartData = {
    labels: formattedLabels,
    datasets: [
      {
        label: 'Weekly Revenue',
        data: weeklyRevenueData.map((data) => data.total_revenue),
        backgroundColor: 'rgba(129, 140, 248, 0.6)',
        borderColor: 'rgba(129, 140, 248, 1)',
        borderWidth: 1,
      },
    ],
  }

  const chartOptions: Partial<ChartOptions<'bar'>> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#4B5563',
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: Rs ${context.raw}`,
        },
      },
      title: {
        display: true,
        text: 'Weekly Revenue',
        color: '#1F2937',
        font: {
          size: 18,
          weight: 'bold',
          family: 'Inter, sans-serif',
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Weeks',
          color: '#4B5563',
          font: {
            size: 14,
            weight: 'bold',
            family: 'Inter, sans-serif',
          },
        },
        ticks: {
          color: '#4B5563',
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Revenue (Rs)',
          color: '#4B5563',
          font: {
            size: 14,
            weight: 'bold',
            family: 'Inter, sans-serif',
          },
        },
        ticks: {
          color: '#4B5563',
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
          callback: (value: number | string) => `Rs ${value}`,
        },
      },
    },
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 px-6 py-4 flex justify-between items-center border-b border-indigo-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-900 truncate">{restaurant.Restaurant_Name}</h2>
          <button
            onClick={() => setIsStatsOpen(false)}
            className="text-purple-500 hover:text-indigo-700 transition-colors duration-200"
            aria-label="Close stats popup"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-1/3">
              <img
                src={restaurant.Restaurant_Image || "/placeholder.svg?height=300&width=300"}
                alt={restaurant.Restaurant_Name}
                className="w-full h-48 sm:h-full object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div className="w-full sm:w-2/3 flex flex-col justify-center space-y-4">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                <p className="text-indigo-800 text-base sm:text-lg">{restaurant.Address}</p>
              </div>
              <div className="flex items-center space-x-6 my-2">
                <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                  <Star className="w-5 h-5 text-yellow-500 mr-1" />
                  <p className="text-yellow-700 font-semibold">{restaurant.Rating}</p>
                </div>
                <div className="flex items-center bg-gradient-to-br from-purple-200 to-indigo-200  px-3 py-1 rounded-full">
                  <MessageSquare className="w-5 h-5 text-indigo-600 mr-1" />
                  <p className="text-indigo-700 font-semibold">{statistics.review_count} reviews</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-gradient-to-br from-purple-200 to-indigo-200 rounded-2xl p-6 flex items-start space-x-4 transition-all duration-300 hover:shadow-lg group">
                <div className="bg-indigo-200 rounded-full p-3 flex-shrink-0 group-hover:bg-indigo-300 transition-colors duration-300">
                  <stat.icon className="w-6 h-6 text-indigo-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-indigo-600 mb-1">{stat.label}</p>
                  <p className="text-lg font-bold text-indigo-900">{stat.value}</p>
                </div>
              </div>
            ))}


            <div
              className="bg-gradient-to-br from-purple-200 to-indigo-200 rounded-2xl p-6 flex items-center justify-between w-full max-w-[320px] cursor-pointer group hover:shadow-xl transition-all duration-300"
              onClick={() => setShowGraphModal(true)}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-200 rounded-full p-3 flex-shrink-0 group-hover:bg-indigo-300 transition-colors duration-300">
                  <BarChart className="w-7 h-7 text-purple-900 group-hover:text-indigo-600 transition-all duration-300" />
                </div>
                <div className="text-indigo-600 font-semibold text-lg">Weekly Revenue Graph</div>
              </div>
            </div>

          </div>

          {/* Graph Modal */}
          {showGraphModal && (
            <div className="fixed inset-0 bg-black/60-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center px-6 py-4 border-b border-indigo-100">
                  <h2 className="text-2xl sm:text-3xl font-bold text-indigo-900">Weekly Revenue Graph</h2>
                  <button
                    onClick={() => setShowGraphModal(false)}
                    className="text-indigo-500 hover:text-indigo-700 transition-colors duration-200"
                    aria-label="Close graph modal"
                  >
                    <X className="w-7 h-7" />
                  </button>
                </div>

                <div className="p-6">
                  {Array.isArray(weeklyRevenueData) && weeklyRevenueData.length > 0 ? (
                    <div className="h-[60vh]">
                      <Bar data={chartData} options={chartOptions} />
                    </div>
                  ) : (
                    <p className="text-center text-indigo-600 text-lg">Loading weekly revenue data...</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
