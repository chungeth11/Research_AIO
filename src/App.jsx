import { useEffect, useState } from 'react'
import './App.css'
import Auth from './Pages/Auth'
import Sidebar from './UIparts/Sidebar'
import Data from './Pages/Data'
import ELN from './Pages/ELN'
import Experiments from './Pages/Experiments'
import Inventory from './Pages/Inventory'
import Lab_home from './Pages/Lab_home'
import Labs from './Pages/Labs'
import Profile from './Pages/Profile'
import Schedule from './Pages/Schedule'
import Settings from './Pages/Settings'
import { labs } from './Pages/Labs'
import authClient from './auth/authClient'


const pages = {
Data,
ELN,
Experiments,
Inventory,
Lab_home,
Profile,
Schedule,
Settings,
Labs,
}
function App() {
  const [activeTab, setActiveTab] = useState('Lab_home')
  const [selectedLabId, setSelectedLabId] = useState(labs[0].id)
  const [calendarFocus, setCalendarFocus] = useState(null)
  const [inventoryFocus, setInventoryFocus] = useState(null)
  const [authState, setAuthState] = useState({ loading: true, session: null, error: null })
  const selectedLab = labs.find(({ id }) => id === selectedLabId) ?? labs[0]
  const ActivePage = pages[activeTab]

  useEffect(() => {
    let isMounted = true
    const unsubscribe = authClient.subscribe((session) => {
      if (isMounted) {
        setAuthState({ loading: false, session, error: null })
      }
    })

    authClient.getSession()
      .then(({ session, error }) => {
        if (isMounted) {
          setAuthState({ loading: false, session, error })
        }
      })
      .catch((error) => {
        if (isMounted) {
          setAuthState({ loading: false, session: null, error })
        }
      })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  if (authState.loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 text-sm font-medium text-slate-600">
        Loading your workspace...
      </main>
    )
  }

  if (!authState.session) {
    return (
      <Auth
        authMode={authClient.mode}
        authError={authState.error?.message}
        onSignIn={(credentials) => authClient.signIn(credentials)}
        onSignUp={(credentials) => authClient.signUp(credentials)}
        onGoogleSignIn={() => authClient.signInWithGoogle()}
      />
    )
  }

  async function handleSignOut() {
    try {
      const { error } = await authClient.signOut()
      if (error) {
        setAuthState((current) => ({ ...current, error }))
      }
    } catch (error) {
      setAuthState((current) => ({ ...current, error }))
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-neutral-50 text-white">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userEmail={authState.session.user?.email}
        onLogout={handleSignOut}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      {authState.error && (
        <p role="alert" className="bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {authState.error.message}
        </p>
      )}
      <main className={`min-h-0 min-w-0 flex-1 ${
        activeTab === 'Experiments'
          ? 'overflow-hidden'
          : activeTab === 'Labs'
            ? 'overflow-hidden'
            : 'overflow-y-auto overflow-x-hidden p-4 sm:p-8'
      }`}>
        <ActivePage
          key={`${activeTab}-${selectedLabId}`}
          onTabChange={setActiveTab}
          lab={selectedLab}
          userId={authState.session.user?.id}
          selectedLabId={selectedLabId}
          onSelectedLabChange={setSelectedLabId}
          calendarFocus={activeTab === 'Schedule' ? calendarFocus : null}
          onCalendarNavigate={(date, time) => {
            setCalendarFocus({ date, time })
            setActiveTab('Schedule')
          }}
          onCalendarFocusHandled={() => setCalendarFocus(null)}
          inventoryFocus={activeTab === 'Inventory' ? inventoryFocus : null}
          onInventoryNavigate={(itemName) => {
            setInventoryFocus({ itemName })
            setActiveTab('Inventory')
          }}
          onInventoryFocusHandled={() => setInventoryFocus(null)}
        />
      </main>
      </div>
    </div>
  )
}

export default App
