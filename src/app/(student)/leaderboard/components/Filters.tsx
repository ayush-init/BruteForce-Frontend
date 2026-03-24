"use client";

import React, { useState, useEffect } from 'react';
import { Search, MapPin, CalendarDays, TrendingUp } from 'lucide-react';
import { Select } from '@/components/Select';
import { getAdminCities } from '@/services/admin.service';
import { getAllBatches } from '@/services/batch.service';

interface FiltersProps {
  lSearch: string;
  setLSearch: (search: string) => void;
  filters: {
    city: string;
    year: number;
    type: string;
  };
  onFiltersChange: (filters: { city: string; year: number; type: string }) => void;
}

export function Filters({ lSearch, setLSearch, filters, onFiltersChange }: FiltersProps) {
  const [allCities, setAllCities] = useState<string[]>([]);
  const [allYears, setAllYears] = useState<number[]>([]);
  const [cityYearMap, setCityYearMap] = useState<Record<string, Set<number>>>({});

  // Fetch cities and years data
  useEffect(() => {
    getAdminCities().then(res => {
      const cities = res.map((c: any) => c.city_name);
      setAllCities(cities);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    getAllBatches().then(res => {
      const map: Record<string, Set<number>> = {};
      const globalYears = new Set<number>();

      res.forEach((item: any) => {
        const city = item.city?.city_name?.toLowerCase();
        const year = item.year || item.batch_year;

        if (city && year) {
          if (!map[city]) {
            map[city] = new Set();
          }
          map[city].add(Number(year));
        }
        if (year) {
          globalYears.add(Number(year));
        }
      });

      setCityYearMap(map);
      setAllYears(Array.from(globalYears).sort((a, b) => b - a));
    }).catch(console.error);
  }, []);

  // Get year options based on selected city
  const yearOptions = React.useMemo(() => {
    if (filters.city === "all" || !filters.city) {
      return allYears;
    }
    const cityKey = filters.city.toLowerCase();
    const cityYears = cityYearMap[cityKey] ? Array.from(cityYearMap[cityKey]).sort((a, b) => b - a) : [];
    return cityYears;
  }, [filters.city, allYears, cityYearMap]);

  // Handle city change with year reset logic
  const handleCityChange = (newCity: string | number) => {
    const cityStr = String(newCity);
    const cityKey = cityStr.toLowerCase();
    
    // For "all" city, use all years, otherwise use city-specific years
    let nextYearOptions;
    if (cityStr === "all" || !cityStr) {
      nextYearOptions = allYears;
    } else {
      nextYearOptions = cityYearMap[cityKey] ? Array.from(cityYearMap[cityKey]).sort((a, b) => b - a) : [];
    }

    let newYear = filters.year;
    if (nextYearOptions.length > 0 && !nextYearOptions.includes(filters.year)) {
      newYear = nextYearOptions[0];
    } else if (nextYearOptions.length === 0) {
      newYear = 0;
    }

    console.log('🏙️ City change:', { newCity: cityStr, nextYearOptions, selectedYear: newYear });

    onFiltersChange({
      city: cityStr,
      year: newYear,
      type: filters.type
    });
  };

  // Handle year change
  const handleYearChange = (newYear: string | number) => {
    onFiltersChange({
      city: filters.city,
      year: Number(newYear),
      type: filters.type
    });
  };

  // Handle type change
  const handleTypeChange = (newType: string | number) => {
    onFiltersChange({
      city: filters.city,
      year: filters.year,
      type: String(newType)
    });
  };

  // Prepare options for Select components
  const cityOptions = [
    { label: 'All Cities', value: 'all' },
    ...allCities.map(city => ({ label: city, value: city }))
  ];

  const yearOptionsList = [
    { label: 'All Years', value: 0 },
    ...yearOptions.map(year => ({ label: year.toString(), value: year }))
  ];

  const typeOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'This Month', value: 'monthly' },
    { label: 'This Week', value: 'weekly' }
  ];

  return (
    <div className="p-4 border-b border-border flex flex-wrap items-center gap-3 bg-card/60 backdrop-blur-md">
      <div className="flex items-center gap-1.5 text-foreground font-semibold px-2 border-r border-border mr-2 opacity-80">
        <Search className="w-4 h-4"/> Filter
      </div>
      
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          type="text"
          placeholder="Search by username..."
          value={lSearch}
          onChange={(e) => setLSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
      </div>
      
      <Select 
        value={filters.type} 
        onChange={handleTypeChange}
        options={typeOptions}
        className="w-[140px] h-9 text-sm"
        icon={<TrendingUp className="w-3.5 h-3.5" />}
        placeholder="Timeframe"
      />
      
      <Select 
        value={filters.city} 
        onChange={handleCityChange}
        options={cityOptions}
        className="w-[150px] h-9 text-sm"
        icon={<MapPin className="w-3.5 h-3.5" />}
        placeholder="City"
      />

      <Select 
        value={filters.year.toString()} 
        onChange={handleYearChange}
        options={yearOptionsList}
        className="w-[130px] h-9 text-sm"
        icon={<CalendarDays className="w-3.5 h-3.5" />}
        placeholder="Year"
        disabled={yearOptions.length === 0}
      />
      
      {yearOptions.length === 0 && (
        <span className="text-xs text-muted-foreground ml-2">No years available</span>
      )}
    </div>
  );
}
