import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import Filter from "../components/Filter";

const DynamicMap = dynamic(() => import("../components/Map"), { ssr: false });

export default function HomePage() {
  const [selectedContinent, setSelectedContinent] = useState("all");
  const [searchText, setSearchText] = useState("");

  const filters = useMemo(
    () => ({ selectedContinent, searchText }),
    [selectedContinent, searchText]
  );

  return (
    <div className="min-h-svh flex flex-col">
      <header className="p-2 border-b bg-white">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <h1 className="text-base font-semibold whitespace-nowrap">Distributor Map</h1>
          <Filter
            inline
            selectedContinent={selectedContinent}
            onContinentChange={setSelectedContinent}
            searchText={searchText}
            onSearchTextChange={setSearchText}
          />
        </div>
      </header>

      <main className="relative flex-1 min-h-0">
        <DynamicMap filters={filters} />
      </main>
    </div>
  );
}


