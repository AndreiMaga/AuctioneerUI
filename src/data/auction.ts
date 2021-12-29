import { DocumentData, QueryDocumentSnapshot } from "@firebase/firestore";

export interface IBid{
  id: string,
  time?: number,
  bid?: number,
  userId?: string
  username?: string
}

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
  bidsId?: string
}


export function docToIBidArray(doc: QueryDocumentSnapshot<DocumentData>) : IBid
{

  return {
    id: doc.id,
    ...doc.data()
  }

}


export function docToIAuction(doc : QueryDocumentSnapshot<DocumentData>) : IAuction{
  return {
    id : doc.id,
    ...doc.data()
  }
}