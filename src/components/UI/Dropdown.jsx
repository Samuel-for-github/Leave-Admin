// components/UI/Dropdown.jsx
import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function Dropdown({
                                     options,
                                     value,
                                     onChange,
                                     placeholder = "Select an option",
                                     label,
                                     className = ""
                                 }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange(option.value);
        setIsOpen(false);
    };

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
                <span className={`block truncate ${!selectedOption ? 'text-gray-400' : 'text-gray-900'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDownIcon
                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                    />
                </span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSelect(option)}
                            className={`
                                relative w-full text-left py-2 pl-3 pr-9 cursor-pointer select-none hover:bg-indigo-50
                                ${option.value === value ? 'bg-indigo-50 text-indigo-900' : 'text-gray-900'}
                            `}
                        >
                            <span className={`block truncate ${option.value === value ? 'font-medium' : 'font-normal'}`}>
                                {option.label}
                            </span>
                            {option.value === value && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600">
                                    <CheckIcon className="h-5 w-5" />
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}