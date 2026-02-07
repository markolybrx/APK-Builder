export function Input({ label, type = "text", placeholder, value, onChange, required }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-2 text-slate-400">{label}</label>}
      <input
        type={type}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
