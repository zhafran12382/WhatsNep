import Header from './Header'
import Sidebar from './Sidebar'

/**
 * Main layout component for chat dashboard
 */
const MainLayout = ({ children }) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout
