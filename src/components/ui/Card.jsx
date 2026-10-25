import { cn } from '../../lib/cn'

export default function Card({ as: Tag = 'section', className, children, ...props }) {
  return (
    <Tag
      className={cn('rounded-panel border border-line bg-paper p-6 shadow-panel', className)}
      {...props}
    >
      {children}
    </Tag>
  )
}
