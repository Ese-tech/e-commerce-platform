import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface AutocompleteOption {
  value: string;
  label: string;
  secondary?: string;
}

interface AutocompleteInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: AutocompleteOption[];
  placeholder?: string;
  required?: boolean;
  onSearch?: (query: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  onSearch,
  loading = false,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const uniqueId = useRef(`autocomplete-${Math.random().toString(36).substr(2, 9)}`).current;

  // Filter options based on search query
  const filteredOptions = searchQuery 
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.secondary?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options; // Show all options when no search query

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    onChange(newValue);
    
    if (onSearch) {
      onSearch(newValue);
    }
    
    if (!isOpen) {
      setIsOpen(true);
    }
    setHighlightedIndex(-1);
  };

  // Handle input focus - show all options
  const handleInputFocus = () => {
    console.log('Input focused, opening dropdown');
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  // Handle input click - same as focus but ensure dropdown opens
  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Input clicked, current isOpen:', isOpen);
    if (!isOpen) {
      setIsOpen(true);
      setHighlightedIndex(-1);
      // Clear search to show all options when clicking
      setSearchQuery('');
    }
  };
  const handleOptionSelect = (option: AutocompleteOption) => {
    onChange(option.value);
    setSearchQuery(option.value);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        return;
      }
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const dropdown = document.querySelector(`[data-dropdown-id="${uniqueId}"]`);
      
      if (inputRef.current && !inputRef.current.contains(target) && 
          (!dropdown || !dropdown.contains(target))) {
        console.log('Clicking outside, closing dropdown for', uniqueId);
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, uniqueId]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (listRef.current && highlightedIndex >= 0) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [highlightedIndex]);

  // Update search query when value changes externally
  useEffect(() => {
    // Only update search query if dropdown is closed
    if (!isOpen) {
      setSearchQuery(value);
    }
  }, [value, isOpen]);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          ref={inputRef}
          id={uniqueId}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onClick={handleInputClick}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
          ) : (
            <div className="flex items-center space-x-1">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              <ChevronDownIcon 
                className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              />
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div 
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
          data-dropdown-id={uniqueId}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {filteredOptions.length > 0 ? (
            <ul ref={listRef} className="py-1">
              {filteredOptions.map((option, index) => (
                <li
                  key={`${option.value}-${index}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Option clicked:', option.label);
                    handleOptionSelect(option);
                  }}
                  className={`px-4 py-3 cursor-pointer transition-colors ${
                    index === highlightedIndex 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{option.label}</span>
                    {option.secondary && (
                      <span className="text-sm text-gray-500 mt-1">{option.secondary}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-gray-500 text-center">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};