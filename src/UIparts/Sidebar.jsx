const tabs = [
{
    name: 'Lab_home',
    icon: (
      <>
        <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1V10Z" />
      </>
    ),
  },
    {
    name: 'Schedule',
    icon: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
        <path d="m9 16 2 2 4-4" />
      </>
    ),
  },
    {
    name: 'Inventory',
    icon: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 16 9 5 9-5" />
      </>
    ),
  },

  {
    name: 'Experiments',
    icon: (
      <>
        <path d="M9 3h6" />
        <path d="M10 3v6.5l-5.1 8.1A2.3 2.3 0 0 0 6.8 21h10.4a2.3 2.3 0 0 0 1.9-3.4L14 9.5V3" />
        <path d="M8 15h8" />
      </>
    ),
  },
  // {
  //   name: 'Data',
  //   icon: (
  //     <>
  //       <ellipse cx="12" cy="5" rx="8" ry="3" />
  //       <path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
  //       <path d="M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" />
  //     </>
  //   ),
  // },

  {
    name: 'Profile',
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21v-2a7 7 0 0 1 14 0v2H5Z" />
      </>
    ),
  },

]

function Sidebar({ activeTab, onTabChange, onLogoClick }) {
  return (
    <aside className="h-screen w-20 shrink-0 overflow-y-auto border-r border-gray-800 bg-gray-400 text-white">
      <div className="p-3">
        <button
          type="button"
          onClick={onLogoClick}
          aria-label="Open Labs"
          title="Labs"
          className=" w-full bg-slate-300 pt-3 rounded-3xl text-blue-400 pb-3 text-center text-xl font-bold transition hover:text-blue-600 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          D
        </button>
        <nav aria-label="Main navigation">
          <ul className="mt-4 space-y-2">
            {tabs.map(({ name, icon }) => (
              <li key={name}>
                <button
                  type="button"
                  aria-label={name}
                  aria-current={activeTab === name ? 'page' : undefined}
                  title={name}
                  onClick={() => onTabChange(name)}
                  className={`flex w-full justify-center rounded-lg p-3 text-gray-400 transition-colors hover:bg-gray-200 hover:text-white ${
                    activeTab === name ? 'bg-gray-100 text-white' : ''
                  }`}
                >
                  <svg
                    aria-hidden="true"
                    className="h-8 w-8 bg-blue-500 rounded-full p-1"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    {icon}
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
