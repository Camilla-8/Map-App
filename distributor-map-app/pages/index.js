import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import Filter from "../components/Filter";
import QRCodePanel from "../components/QRCode";

const DynamicMap = dynamic(() => import("../components/Map"), { ssr: false });

export default function HomePage() {
  const [selectedContinent, setSelectedContinent] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [isClient, setIsClient] = useState(false);

  const filters = useMemo(
    () => ({ selectedContinent, searchText }),
    [selectedContinent, searchText]
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-svh flex flex-col">
      <header className="p-2 border-b bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <h1 className="text-base font-semibold">Distributor Map</h1>
          <Filter
            inline
            selectedContinent={selectedContinent}
            onContinentChange={setSelectedContinent}
            searchText={searchText}
            onSearchTextChange={setSearchText}
          />
          {isClient && (
            <div className="sm:ml-auto hidden sm:block">
              <QRCodePanel text={window.location.href} size={56} />
            </div>
          )}
        </div>
      </header>

      <main className="relative flex-1 min-h-0">
        <DynamicMap filters={filters} />
      </main>
    </div>
  );
}


