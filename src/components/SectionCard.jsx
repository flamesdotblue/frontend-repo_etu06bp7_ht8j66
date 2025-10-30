export default function SectionCard({ title, icon, children, footer }) {
  const Icon = icon;
  return (
    <div className="bg-white/80 backdrop-blur border border-white/50 rounded-2xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-3">
        {Icon && (
          <div className="p-2 rounded-xl bg-gray-100 text-gray-700">
            <Icon size={18} />
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div>{children}</div>
      {footer && <div className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-600">{footer}</div>}
    </div>
  );
}
