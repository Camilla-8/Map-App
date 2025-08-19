export default function Filter({
  selectedContinent,
  onContinentChange,
  searchText,
  onSearchTextChange,
  inline = false,
}) {
  if (inline) {
    return (
      <div className="flex items-center gap-2">
        <select
          className="border rounded px-2 py-1 text-sm"
          value={selectedContinent}
          onChange={(e) => onContinentChange?.(e.target.value)}
          aria-label="Continent"
        >
          <option value="all">All</option>
          <option value="asia">Asia</option>
          <option value="middle east">Middle East</option>
          <option value="africa">Africa</option>
        </select>
        <input
          className="border rounded px-2 py-1 text-sm min-w-[160px]"
          type="text"
          placeholder="Company search"
          value={searchText}
          onChange={(e) => onSearchTextChange?.(e.target.value)}
          aria-label="Company search"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Continent</label>
        <select
          className="w-full border rounded px-3 py-2 text-sm"
          value={selectedContinent}
          onChange={(e) => onContinentChange?.(e.target.value)}
        >
          <option value="all">All</option>
          <option value="asia">Asia</option>
          <option value="middle east">Middle East</option>
          <option value="africa">Africa</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Company</label>
        <input
          className="w-full border rounded px-3 py-2 text-sm"
          type="text"
          placeholder="Search company…"
          value={searchText}
          onChange={(e) => onSearchTextChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}


