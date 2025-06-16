"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { MenuItem } from "~/content/menu";
import { ActiveLink } from "../active-link";
import { SearchResults } from "../search-results";
import { Input } from "../ui/input";

interface Props {
  title: string;
  menu: MenuItem[];
  children: React.ReactNode;
}

export function SettingsLayout(props: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const filteredMenu = useMemo(() => {
    if (!searchQuery) return props.menu;
    
    return props.menu.filter((item) => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [props.menu, searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-medium">{props.title}</h1>
      <div>
        <div className="mt-0 flex h-fit w-full gap-10">
          <div className="hidden flex-1/4 pt-12 md:block md:min-h-full">
            <div className="sticky top-32 h-fit">
              <div ref={searchContainerRef} className="relative">
                <Input 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                  className="w-full"
                />
                {showResults && (
                  <SearchResults 
                    query={searchQuery} 
                    onClose={() => setShowResults(false)} 
                  />
                )}
              </div>
              <div className="mt-10 grid w-full">
                {filteredMenu.map((m) => (
                  <ActiveLink
                    key={m.href}
                    href={m.href}
                    strict
                    className="hover:bg-accent/80 text-muted-foreground data-[active=true]:text-foreground mb-1.5 w-full rounded-md px-2 py-2 text-sm transition-all"
                  >
                    {m.label}
                  </ActiveLink>
                ))}
                {filteredMenu.length === 0 && searchQuery && (
                  <div className="text-muted-foreground text-sm px-2 py-2">
                    No menu items found
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="h-fit pt-8 md:flex-3/4 md:pt-12">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
}
