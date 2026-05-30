interface RecognitionCardProps {
  name: string;
  description: string;
  badge?: string;
  badgeType?: 'image' | 'emoji';
}

export function RecognitionCard({
  name,
  description,
  badge,
  badgeType = 'emoji',
}: RecognitionCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#D8D0F0] p-6 md:p-8 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Badge (opcional) */}
        {badge && (
          <div className="flex-shrink-0">
            {badgeType === 'emoji' ? (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 to-yellow-400 flex items-center justify-center shadow-lg">
                <span className="text-5xl" role="img" aria-label="badge">
                  {badge}
                </span>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 border-[#D8D0F0]">
                <img
                  src={badge}
                  alt="Badge"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[#3D2C8D] font-semibold text-[20px] md:text-[22px] mb-2 leading-tight">
            {name}
          </h3>
          <p className="text-slate-600 text-[15px] md:text-[16px] leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
