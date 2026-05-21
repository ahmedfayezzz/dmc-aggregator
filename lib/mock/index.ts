export * from "./wholesalers"
export * from "./agencies"
export * from "./dmcs"
export * from "./itineraries"
export * from "./bookings"
export * from "./rfqs"
export * from "./wallet"
export * from "./departures"
export * from "./photos"
export * from "./custom-requests"
export * from "./markup-rules"

// Convenience lookups
import { itineraries } from "./itineraries"
import { agencies } from "./agencies"
import { dmcs } from "./dmcs"
import { bookings } from "./bookings"

export const findItinerary = (id: string) => itineraries.find((i) => i.id === id)
export const findAgency = (id: string) => agencies.find((a) => a.id === id)
export const findDMC = (id: string) => dmcs.find((d) => d.id === id)
export const findBooking = (id: string) => bookings.find((b) => b.id === id)
