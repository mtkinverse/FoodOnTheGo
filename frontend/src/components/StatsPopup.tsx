import React, { useEffect, useState } from 'react'
import { X, ShoppingCart, DollarSign, TrendingUp, Utensils } from 'lucide-react'
import axios from 'axios'

interface Restaurant {
  Restaurant_id: string
  Restaurant_Name: string
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
}

export function StatsPopup({ setIsStatsOpen, restaurant }: StatsPopupProps) {
  if (!restaurant) return null

  const [statistics, setStats] = useState<Statistics>({
    totalOrders: 0,
    totalEarnings: 0,
    averageOrdersPerDay: 0,
    mostPopularItem: '',
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
    { label: 'Average Total Orders(weekly)', value: statistics.totalOrders, icon: ShoppingCart },
    { label: 'Total Earnings(weekly)', value: `Rs.${statistics.totalEarnings}`, icon: DollarSign },
    { label: 'Average Orders(per day)', value: statistics.averageOrdersPerDay, icon: TrendingUp },
    { label: 'Most Popular Item', value: statistics.mostPopularItem, icon: Utensils },
  ]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-800">{restaurant.Restaurant_Name} Statistics</h2>
          <button
            onClick={() => setIsStatsOpen(false)}
            className="text-purple-500 hover:text-purple-700 transition-colors duration-200"
            aria-label="Close stats popup"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-purple-50 rounded-lg p-4 flex flex-col items-center space-y-2 transition-all duration-200 hover:bg-purple-300 hover:shadow-md">
              <div className="bg-purple-200 rounded-full p-3">
                <stat.icon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-purple-600">{stat.label}</p>
                <p className="text-lg font-semibold text-purple-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


 