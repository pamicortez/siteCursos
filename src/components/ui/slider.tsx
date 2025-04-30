import * as React from "react"
import * as RadixSlider from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface SliderProps extends React.ComponentPropsWithoutRef<typeof RadixSlider.Root> {
  className?: string
}

export const Slider = React.forwardRef<React.ElementRef<typeof RadixSlider.Root>, SliderProps>(
  ({ className, ...props }, ref) => {
    return (
      <RadixSlider.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        {...props}
      >
        <RadixSlider.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-blue-200">
          <RadixSlider.Range className="absolute h-full bg-blue-500" />
        </RadixSlider.Track>
        <RadixSlider.Thumb className="block h-4 w-4 rounded-full border-2 border-blue-500 bg-white shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </RadixSlider.Root>
    )
  }
)
Slider.displayName = "Slider"
