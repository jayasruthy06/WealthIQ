import BarLoader from '@/components/BarLoader'
import React, { Suspense } from 'react'
import DashboardPage from './page'

const DashboardLayout = () => {
  return (
    <div className="px-5">
        <Suspense
            fallback={<BarLoader/>}
        >
            <DashboardPage/>
        </Suspense>
    </div>
  )
}

export default DashboardLayout