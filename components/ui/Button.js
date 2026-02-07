export function Button({ children, onClick, variant = 'primary', disabled, className = '' }) {
  const baseStyle = "px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 border border-transparent",
    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-sm",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
