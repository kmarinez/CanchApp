export default function LogoLoading() {
    return (
      <div className="logo-loading-wrapper">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="12" fill="#2E8B57" className="svg-elem-1" />
          <rect x="12" y="12" width="40" height="40" rx="4" stroke="white" strokeWidth="3" className="svg-elem-2" />
          <line x1="32" y1="12" x2="32" y2="52" stroke="white" strokeWidth="3" className="svg-elem-3" />
          <circle cx="32" cy="32" r="5" stroke="white" strokeWidth="3" className="svg-elem-4" />
          <path d="M12 24 C20 24, 20 40, 12 40" stroke="white" strokeWidth="3" className="svg-elem-5" />
          <path d="M52 24 C44 24, 44 40, 52 40" stroke="white" strokeWidth="3" className="svg-elem-6" />
        </svg>
      </div>
    );
}


  