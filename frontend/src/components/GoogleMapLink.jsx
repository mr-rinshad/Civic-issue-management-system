import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

const GoogleMapLink = ({ location, className = '' }) => {
  if (!location) return null;

  const { latitude, longitude, address } = location;

  let mapUrl = '';
  if (latitude && longitude) {
    mapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  } else if (address) {
    mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  } else {
    return <span className="text-slate-400">No location specified</span>;
  }

  return (
    <a
      href={mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      title="Click to open location in Google Maps"
      className={`inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline font-semibold cursor-pointer group transition ${className}`}
    >
      <MapPin className="w-4 h-4 mr-1 text-red-500 group-hover:scale-110 transition shrink-0" />
      <span className="truncate">{address || `${latitude}, ${longitude}`}</span>
      <ExternalLink className="w-3 h-3 ml-1 text-slate-400 group-hover:text-blue-600 shrink-0" />
    </a>
  );
};

export default GoogleMapLink;
