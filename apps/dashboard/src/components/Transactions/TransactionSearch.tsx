/**
 * Componente de Busca de Transações - Tech Challenge POSTECH
 * Implementa busca avançada com sugestões e autocomplete
 */

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { Input } from '../Input';

interface TransactionSearchProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  suggestions?: string[];
  className?: string;
}

export const TransactionSearch: React.FC<TransactionSearchProps> = ({
  onSearch,
  placeholder = "Buscar transações...",
  suggestions = [],
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Filtrar sugestões baseadas no termo de busca
  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, suggestions]);

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {/* Ícone de busca customizado */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <Icon 
            icon="mdi:magnify" 
            className="h-5 w-5 text-gray-400" 
          />
        </div>
        
        <Input
          id="transaction-search"
          label=""
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => filteredSuggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          variant="default"
          style={{ paddingLeft: '2.5rem' }}
        />
        
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center z-10
                     text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon icon="mdi:close" className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Sugestões */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 
                   rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          <div className="py-1">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700
                         hover:bg-blue-50 hover:text-blue-900 
                         focus:bg-blue-50 focus:text-blue-900 focus:outline-none
                         transition-colors duration-150"
              >
                <div className="flex items-center">
                  <Icon 
                    icon="mdi:history" 
                    className="h-4 w-4 text-gray-400 mr-2" 
                  />
                  <span>{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Indicador de busca ativa */}
      {searchTerm && (
        <div className="mt-2 flex items-center text-xs text-gray-500">
          <Icon icon="mdi:filter" className="h-3 w-3 mr-1" />
          <span>Filtrando por: &quot;{searchTerm}&quot;</span>
        </div>
      )}
    </div>
  );
};
