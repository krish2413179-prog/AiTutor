import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: 'green' | 'purple' | 'blue';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, color = 'green' }) => {
  const colorClasses = {
    green: 'from-[#14F195]/20 to-[#14F195]/5 border-[#14F195]/20',
    purple: 'from-[#9945FF]/20 to-[#9945FF]/5 border-[#9945FF]/20',
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/20',
  };

  const iconColorClasses = {
    green: 'text-[#14F195]',
    purple: 'text-[#9945FF]',
    blue: 'text-blue-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-6 rounded-xl bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-white/5 ${iconColorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className="text-xs text-gray-400 font-medium">{trend}</span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-sm text-gray-400">{title}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard;
