interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 响应式内容容器
 * - 移动端：全宽，小边距
 * - 桌面端：最大宽度 1280px，居中，大边距
 */
export function ResponsiveContainer({ children, className = '' }: ResponsiveContainerProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
