'use client'
import { useEffect } from 'react'
import { useStore } from 'react-redux'
import { injectStore } from '@/api/axios'

export default function StoreInjector() {
  const store = useStore()

  useEffect(() => {
    // console.log('Injecting store from StoreInjector:', store)
    injectStore(store)
  }, [store])

  return null
}
