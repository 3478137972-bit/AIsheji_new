'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const tabListVariants = cva(
  'inline-flex items-center justify-center rounded-md p-1',
  {
    variants: {
      variant: {
        default: 'bg-cream-100',
        outline: 'border border-cool-200 bg-transparent',
      },
      orientation: {
        horizontal: 'flex',
        vertical: 'flex-col',
      },
    },
    defaultVariants: {
      variant: 'default',
      orientation: 'horizontal',
    },
  }
)

const tabTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-cream-50 text-cool-900 shadow-sm hover:bg-cream-100 hover:text-cool-950',
        primary: 'bg-primary-600 text-cream-50 shadow-sm hover:bg-primary-700',
        outline: 'bg-transparent hover:bg-cream-100 text-cool-700',
      },
      orientation: {
        horizontal: '',
        vertical: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      orientation: 'horizontal',
    },
  }
)

const TabList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
    VariantProps<typeof tabListVariants>
>(({ className, variant, orientation, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabListVariants({ variant, orientation, className }))}
    {...props}
  />
))
TabList.displayName = TabsPrimitive.List.displayName

const TabTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
    VariantProps<typeof tabTriggerVariants>
>(({ className, variant, orientation, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabTriggerVariants({ variant, orientation, className }))}
    {...props}
  />
))
TabTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
))
TabContent.displayName = TabsPrimitive.Content.displayName

const Tab = TabsPrimitive.Root
const TabPanel = TabsPrimitive.Content

export { Tab, TabList, TabTrigger, TabContent, TabPanel }
