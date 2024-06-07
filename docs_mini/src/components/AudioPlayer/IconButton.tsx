import React from 'react';
import cn from 'classnames';

type Intent = 'primary' | 'secondary';
type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface IconButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  intent?: Intent; // can add more
  size?: Size;
}

const colorMap: Record<Intent, string> = {
  primary: 'bg-amber-600 text-white',
  secondary: 'bg-slate-800 text-slate-400',
};

const sizeMap: Record<Size, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
  xl: 'h-12 w-12',
  '2xl': 'h-16 w-16',
};

export default function IconButton({
  intent = 'primary',
  size = 'md',
  className,
  ...props
}: IconButtonProps) {
  const colorClass = colorMap[intent];
  const sizeClass = sizeMap[size];
  const classes = cn(
    'rounded-full flex items-center justify-center ring-offset-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 disabled:opacity-60',
    colorClass,
    sizeClass,
    className
  );
  return <button className={classes} {...props} />;
}
