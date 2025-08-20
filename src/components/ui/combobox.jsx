// import React, { useState } from 'react'
// import { Check, ChevronsUpDown } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from './command'
// import { Popover, PopoverTrigger, PopoverContent } from './popover'
// import { Button } from './button'

// export function Combobox({
//   options,
//   placeholder = 'Select...',
//   selected,
//   onChange,
//   widthClass = 'w-[200px]',
// }) {
//   const [open, setOpen] = useState(false)

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className={cn(`${widthClass} justify-between`)}
//         >
//           {selected
//             ? options.find((opt) => opt.value === selected)?.label
//             : placeholder}
//           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className={`${widthClass} p-0`}>
//         <Command>
//           <CommandInput placeholder="Search..." />
//           <CommandEmpty>No results found.</CommandEmpty>
//           <CommandGroup>
//             {options.map((option) => (
//               <CommandItem
//                 key={option.value}
//                 value={option.value}
//                 onSelect={() => {
//                   onChange(option.value)
//                   setOpen(false)
//                 }}
//               >
//                 <Check
//                   className={cn(
//                     'mr-2 h-4 w-4',
//                     selected === option.value ? 'opacity-100' : 'opacity-0'
//                   )}
//                 />
//                 {option.label}
//               </CommandItem>
//             ))}
//           </CommandGroup>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   )
// }

import React, { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './command'
import { Popover, PopoverTrigger, PopoverContent } from './popover'
import { Button } from './button'

export function Combobox({
  options,
  placeholder = 'Select...',
  selected,
  onChange,
  onOpen, // NEW PROP: handle open event
  widthClass = 'w-[200px]',
}) {
  const [open, setOpen] = useState(false)

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen)
    if (isOpen && typeof onOpen === 'function') {
      onOpen()
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(`${widthClass} justify-between`)}
        >
          {selected
            ? options.find((opt) => opt.value === selected)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`${widthClass} p-0`}>
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => {
                  onChange(option)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selected === option.value ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
