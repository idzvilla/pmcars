export interface TrackingStage {
  name: string
  date: string | null
  isActive: boolean
  hiddenCount?: number
}

export interface TrackingPhotoCategory {
  category: string
  count: number
  thumbnailUrl: string | null
  imageUrls: string[]
}

export interface TrackingData {
  commodity: {
    vin: string
    vehicle: string
    lotNo: string
    insurance: string
  }
  stages: TrackingStage[]
  saleOrigin: {
    origin: string
  }
  delivery: {
    branch: string
    truckingRequired: boolean
  }
  shipping: {
    destination: string
    line: string
    vessel: string
    containerNo: string
    trackingUrl: string | null
  }
  inspection: {
    keys: string
    color: string
    condition: string
    damage: string
  }
  photos: TrackingPhotoCategory[]
}

export type TrackingResult =
  | { success: true; data: TrackingData }
  | { success: false; error: 'not_found' | 'unavailable' | 'parse_error' }

// VIN: 17 chars, A-Z0-9, no I O Q
const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/i

export function isValidVin(vin: string): boolean {
  if (!vin) return false
  return VIN_REGEX.test(vin.trim())
}

// Raw AEC API response shape (partial — only fields we use)
export interface AecTrackingResponse {
  vehicleVinNo?: string
  vehicleMake?: string
  vehicleModel?: string
  vehicleYear?: string | number
  clientZoneOrderStatuses?: Array<{
    status?: { name?: string }
    dateActual?: string | null
    selected?: boolean
  }>
  saleOrigin?: string
  auction?: string
  auctionLocation?: string
  shippingLineTitle?: string
  containerNumber?: string
  lotNo?: string
  bookingNumber?: string
  finalDestinationPortTitle?: string
  vesselName?: string
  trackingUrl?: string
  color?: string
  damage?: string
  newUsed?: string
  inspectionImages?: Array<{ thumb?: { path?: string }; full?: { path?: string } }>
  pickUpImages?: Array<{ thumb?: { path?: string }; full?: { path?: string } }>
  vehicleReceivedImages?: Array<{ thumb?: { path?: string }; full?: { path?: string } }>
  loadingImages?: Array<{ thumb?: { path?: string }; full?: { path?: string } }>
  unloadingImages?: Array<{ thumb?: { path?: string }; full?: { path?: string } }>
}

function mapPhotoCategory(
  category: string,
  images: Array<{ thumb?: { path?: string }; full?: { path?: string } }> = []
): TrackingPhotoCategory {
  return {
    category,
    count: images.length,
    thumbnailUrl: images[0]?.thumb?.path ?? images[0]?.full?.path ?? null,
    imageUrls: images.map((img) => img.full?.path ?? img.thumb?.path ?? '').filter(Boolean),
  }
}

export function mapAecResponse(raw: AecTrackingResponse): TrackingData {
  const vehicle = [raw.vehicleMake, raw.vehicleModel, raw.vehicleYear]
    .filter(Boolean)
    .join(' • ')
    .toUpperCase()

  const saleOriginParts = [raw.auction, raw.auctionLocation].filter(Boolean)
  const origin = saleOriginParts.length > 0 ? saleOriginParts.join(' — ') : (raw.saleOrigin ?? '')

  const stages: TrackingStage[] = (raw.clientZoneOrderStatuses ?? []).map((s) => ({
    name: s.status?.name ?? '',
    date: s.dateActual ?? null,
    isActive: s.selected ?? false,
  }))

  return {
    commodity: {
      vin: raw.vehicleVinNo ?? '',
      vehicle,
      lotNo: raw.lotNo ?? '',
      insurance: '',
    },
    stages,
    saleOrigin: { origin },
    delivery: { branch: '', truckingRequired: false },
    shipping: {
      destination: raw.finalDestinationPortTitle ?? '',
      line: raw.shippingLineTitle ?? '',
      vessel: raw.vesselName ?? '',
      containerNo: raw.containerNumber ?? '',
      trackingUrl: raw.trackingUrl ?? null,
    },
    inspection: {
      keys: '',
      color: raw.color ?? '',
      condition: raw.newUsed ?? '',
      damage: raw.damage ?? '',
    },
    photos: [
      mapPhotoCategory('Inspection', raw.inspectionImages),
      mapPhotoCategory('Pick up', raw.pickUpImages),
      mapPhotoCategory('Received', raw.vehicleReceivedImages),
      mapPhotoCategory('Loading', raw.loadingImages),
      mapPhotoCategory('Unloading', raw.unloadingImages),
    ],
  }
}
