import { useState } from 'react'
import './App.css'
import Sidebar from './UIparts/Sidebar'
import Data from './Pages/Data'
import Experiments from './Pages/Experiments'
import Inventory from './Pages/Inventory'
import Lab_home from './Pages/Lab_home'
import Labs from './Pages/Labs'
import Profile from './Pages/Profile'
import Schedule from './Pages/Schedule'
import { labs } from './Pages/Labs'

const pages = {
Data,
Experiments,
Inventory,
Lab_home,
Profile,
Schedule,
Labs,
}
function App() {
  const [activeTab, setActiveTab] = useState('Lab_home')
  const [selectedLabId, setSelectedLabId] = useState(labs[0].id)
  const selectedLab = labs.find(({ id }) => id === selectedLabId) ?? labs[0]
  const ActivePage = pages[activeTab]

  return (
    <div className="flex h-screen w-full overflow-hidden bg-neutral-50 text-white">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogoClick={() => setActiveTab('Labs')}
      />
      <main className={`min-h-0 min-w-0 flex-1 ${
        activeTab === 'Experiments'
          ? 'overflow-hidden'
          : activeTab === 'Labs'
            ? 'overflow-hidden'
            : 'overflow-y-auto overflow-x-hidden p-4 sm:p-8'
      }`}>
        <ActivePage
          onTabChange={setActiveTab}
          lab={selectedLab}
          selectedLabId={selectedLabId}
          onSelectedLabChange={setSelectedLabId}
        />
      </main>
    </div>
  )
}

export default App
