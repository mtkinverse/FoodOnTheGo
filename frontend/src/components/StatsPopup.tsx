import React, { useEffect, useState } from 'react'
import { X, ShoppingCart, DollarSign, TrendingUp, Utensils, MapPin, Star, MessageSquare } from 'lucide-react'
import axios from 'axios'

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

export function StatsPopup({ setIsStatsOpen, restaurant }: StatsPopupProps) {
  if (!restaurant) return null

  const [statistics, setStats] = useState<Statistics>({
    totalOrders: 0,
    totalEarnings: 0,
    averageOrdersPerDay: 0,
    mostPopularItem: '',
    review_count: 0,
  })

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
      console.log('error fetching statistics')
    }
  }

  useEffect(() => {
    fetchStats()

    const intervalId = setInterval(() => {
      fetchStats()
    }, 30000)

    return () => clearInterval(intervalId)
  }, [restaurant.Restaurant_id])

  const stats = [
    { label: 'Avg. Weekly Orders', value: statistics.totalOrders, icon: ShoppingCart },
    { label: 'Weekly Earnings', value: `Rs.${statistics.totalEarnings.toLocaleString()}`, icon: DollarSign },
    { label: 'Avg. Daily Orders', value: statistics.averageOrdersPerDay.toFixed(1), icon: TrendingUp },
    { label: 'Most Popular Item', value: statistics.mostPopularItem, icon: Utensils },
  ]

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
              <div key={stat.label} className="bg-purple-50 rounded-xl p-4 flex items-start space-x-3 transition-all duration-300 hover:bg-purple-100 hover:shadow-md group">
                <div className="bg-purple-200 rounded-full p-2 flex-shrink-0 group-hover:bg-purple-300 transition-colors duration-300">
                  <stat.icon className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <p className="text-xs font-medium text-purple-600 mb-1">{stat.label}</p>
                  <p className="text-sm font-bold text-purple-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

