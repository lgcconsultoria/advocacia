/** Ângulos do cobe que trazem [lat, lng] para o centro do globo. */
export function locationToAngles(lat: number, lng: number): [number, number] {
  return [Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180];
}
