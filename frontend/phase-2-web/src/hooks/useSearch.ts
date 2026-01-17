'use client'

import { useState } from 'react'
import { taskApi } from '@/lib/api-client'

export const useSearch = () => {
  const [results, setResults] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const search = async (query: string, filters?: any) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    try {
      setLoading(true)
      // Using the existing taskApi, would be extended with search endpoint
      const response = await taskApi.list(1, 50)
      const filtered = response.data.data.filter(
        (task: any) =>
          task.title.toLowerCase().includes(query.toLowerCase()) ||
          task.description?.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    try {
      // Mock suggestions
      const response = await taskApi.list(1, 10)
      const uniqueTitles = [...new Set(
        response.data.data
          .filter((t: any) => t.title.toLowerCase().includes(query.toLowerCase()))
          .map((t: any) => t.title)
      )]
      setSuggestions(uniqueTitles as string[])
    } catch (error) {
      console.error('Failed to get suggestions:', error)
    }
  }

  return { search, getSuggestions, results, suggestions, loading }
}
