
import { SupplierPerformance, LogisticsPartner, EnquiryItem, Vendor } from '../types';

/**
 * Supplier Scoring Logic:
 * score = (delivery_success_rate * 0.5) + (quality_rating * 0.3) + (speed_rank * 0.2)
 */
export const calculateSupplierScore = (perf: SupplierPerformance): number => {
  return (perf.deliverySuccessRate * 0.5) + ((perf.qualityRating / 5) * 0.3) + (perf.speedRank * 0.2);
};

/**
 * Logistics Routing Logic:
 * Determines partner type based on order weight and distance.
 */
export const calculateLogisticsCost = (
  partner: LogisticsPartner,
  distanceKm: number
): number => {
  return partner.base_rate + (distanceKm * partner.per_km_rate);
};

export const getRecommendedPartnerType = (totalWeightKg: number): 'BIKE' | 'TEMPO' | 'TRUCK' => {
  if (totalWeightKg <= 20) return 'BIKE';
  if (totalWeightKg <= 500) return 'TEMPO';
  return 'TRUCK';
};

/**
 * Order Splitting Logic (Simplified):
 * Splits an order quantity across multiple suppliers based on their performance scores.
 */
export const splitOrderAcrossSuppliers = (
  totalQuantity: number,
  suppliers: { vendor: Vendor; available: number }[]
) => {
  // Sort suppliers by their performance score descending
  const sorted = [...suppliers].sort((a, b) => {
    const scoreA = calculateSupplierScore(a.vendor.performance || { deliverySuccessRate: 1, qualityRating: 5, speedRank: 1 });
    const scoreB = calculateSupplierScore(b.vendor.performance || { deliverySuccessRate: 1, qualityRating: 5, speedRank: 1 });
    return scoreB - scoreA;
  });

  const allocations: { vendorId: string; quantity: number }[] = [];
  let remaining = totalQuantity;

  for (const s of sorted) {
    if (remaining <= 0) break;
    const take = Math.min(remaining, s.available);
    if (take > 0) {
      allocations.push({ vendorId: s.vendor.id, quantity: take });
      remaining -= take;
    }
  }

  return { allocations, fulfilled: remaining <= 0, shortage: remaining };
};

/**
 * Accounting Logic:
 * Calculates margin for a single sales entry.
 */
export const calculateMargin = (
  salePrice: number,
  purchasePrice: number,
  logisticsPrice: number,
  gstRate: number
) => {
  const gstInput = purchasePrice * (gstRate / 100);
  const gstOutput = salePrice * (gstRate / 100);
  const margin = salePrice - purchasePrice - logisticsPrice;
  return {
    margin,
    gstPayable: gstOutput - gstInput,
    gstInput,
    gstOutput
  };
};
