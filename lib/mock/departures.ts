import type { Departure } from "@/lib/types"
import { itineraries } from "./itineraries"

export const departures: Departure[] = itineraries.flatMap((it) => it.departures)

export const getDeparturesForItinerary = (itineraryId: string) =>
  departures.filter((d) => d.itineraryId === itineraryId)

export const upcomingDepartures = () => {
  const now = Date.now()
  return departures
    .filter((d) => new Date(d.date).getTime() >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}
