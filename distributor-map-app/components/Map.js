import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

const INITIAL_CENTER = [6.927119564988526, 79.8314852076586];
const INITIAL_ZOOM = 3;

function getInitialViewport() {
  const isMobile =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(max-width: 640px)").matches;
  return {
    center: INITIAL_CENTER,
    zoom: isMobile ? 2 : INITIAL_ZOOM,
  };
}

function ViewportController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: false });
  }, [map, center, zoom]);
  return null;
}

function createIcon(url) {
  return L.icon({
    iconUrl: url,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -28],
    className: "rounded-full shadow-md",
  });
}

export default function Map({ filters }) {
  const [distributors, setDistributors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const initial = getInitialViewport();
  const [mapCenter, setMapCenter] = useState(initial.center);
  const [mapZoom, setMapZoom] = useState(initial.zoom);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      const mql = window.matchMedia("(max-width: 640px)");
      const handleChange = (e) => {
        setMapCenter(INITIAL_CENTER);
        setMapZoom(e.matches ? 2 : INITIAL_ZOOM);
      };
      mql.addEventListener?.("change", handleChange);
      return () => mql.removeEventListener?.("change", handleChange);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const load = async () => {
      try {
        const res = await fetch("/api/distributors");
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        const json = await res.json();
        if (!isMounted) return;
        setDistributors(Array.isArray(json) ? json : []);
        setIsLoading(false);
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || "Failed to load data");
        setIsLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const { selectedContinent, searchText } = filters || {};
    const byContinent = (selectedContinent && selectedContinent !== "all")
      ? (d) => (d.continent || "").toLowerCase() === selectedContinent
      : () => true;
    const bySearch = (searchText || "").trim().length > 0
      ? (d) => (d.company_name || "").toLowerCase().includes(searchText.toLowerCase())
      : () => true;
    return distributors.filter((d) => byContinent(d) && bySearch(d));
  }, [distributors, filters]);

  return (
    <div className="absolute inset-0">
      <MapContainer center={mapCenter} zoom={mapZoom} className="h-full w-full">
        <ViewportController center={mapCenter} zoom={mapZoom} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          subdomains={["a","b","c","d"]}
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
        />

        {filtered.map((item, idx) => {
          const position = [item.latitude, item.longitude];
          const icon = item.logo_url ? createIcon(item.logo_url) : undefined;
          return (
            <Marker key={`${item.company_name}-${idx}`} position={position} icon={icon}>
              <Popup>
                <div className="space-y-1">
                  <div className="font-semibold">{item.company_name || "Company"}</div>
                  {item.greeting_message && (
                    <div className="text-sm text-gray-600">{item.greeting_message}</div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {isLoading && (
          <div className="leaflet-top leaflet-right m-2">
            <div className="px-3 py-1 text-xs rounded bg-white/90 shadow">Loading…</div>
          </div>
        )}
        {error && (
          <div className="leaflet-top leaflet-right m-2">
            <div className="px-3 py-1 text-xs rounded bg-red-50 text-red-700 border border-red-200 shadow">{String(error)}</div>
          </div>
        )}
      </MapContainer>
    </div>
  );
}


