import React from 'react'

interface ReviewSectionProps<T> {
  title: string
  items: T[]
  renderItem: (item: T) => React.ReactNode
  emptyMessage: string
}

export function ReviewSection<T>({
  title,
  items,
  renderItem,
  emptyMessage,
}: ReviewSectionProps<T>) {
  return (
    <section>
      <h2 className='text-2xl font-bold text-foreground mb-4'>{title}</h2>
      {items.length === 0 ? (
        <p className='text-muted-foreground'>{emptyMessage}</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {items.map(renderItem)}
        </div>
      )}
    </section>
  )
}
