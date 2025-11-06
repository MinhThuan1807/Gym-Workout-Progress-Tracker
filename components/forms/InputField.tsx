
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {cn} from '@/lib/utils' 
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'


const InputField = ({
    name,
    label, 
    placeholder, 
    type ="text", 
    register, 
    error, 
    validation, 
    disabled, 
    value
} : FormInputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';
  return (
    <div className="space-y-2">
        <Label htmlFor={name} className="font-inter font-medium">
            {label}
        </Label>    
       <div className='relative'>
            <Input 
                type={isPasswordField && showPassword ? "text" : type}
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                value={value}
                className={cn('bg-input-background border-border', 
                    {'opacity-50 cursor-not-allowed': disabled}
                )}
                {...register(name, validation)}
            />
            {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <Eye className="h-5 w-5" />
            ) : (
              <EyeOff className="h-5 w-5" />
            )}
          </button>
        )}
       </div>
        {error && <p className="text-sm text-red-500">{error.message}</p>}

    </div>
  )
}

export default InputField

