import { DocumentData, QueryDocumentSnapshot } from "@firebase/firestore";

export interface IAuction {
  id: string;
  name?: string;
  description?: string;
  category?: string;
  buyoutPrice?: number;
  buyoutCutoff?: number;
  currentBid?: number;
  lastBid?: number;
  lastUpdate?: number; // unix time
  endTime?: number; // unix time
  startBid?: number;
  bidCount?: number;
  bidPercent?: number;
  photos?: any;
  thumbnail?: any; // 100x180
}


export function docToIAuction(doc : QueryDocumentSnapshot<DocumentData>) : IAuction{
  return {
    id : doc.id,
    ...doc.data()
  }
}