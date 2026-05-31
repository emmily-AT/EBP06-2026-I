interface AchievementCardProps {
  title: string;
  description: string;
  badge?: string; // URL de imagen o emoji
  badgeType?: 'image' | 'emoji';
}

export function AchievementCard({ title, description, badge, badgeType = 'emoji' }: AchievementCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#D8D0F0] p-5 hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        {/* Badge/Icon - Opcional */}
        {badge && (
          <div className="flex-shrink-0">
            {badgeType === 'image' ? (
              <img
                src={badge}
                alt={title}
                className="w-12 h-12 rounded-xl object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFD200] to-[#F2B233] rounded-xl flex items-center justify-center text-2xl">
                {badge}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[#3D2C8D] font-semibold text-[17px] mb-1 break-words">
            {title}
          </h3>
          <p className="text-slate-600 text-[14px] leading-relaxed break-words">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
