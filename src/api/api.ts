import axios from 'axios'


export async function isDev(uid: string): Promise<boolean> {
  return uid === ""
    ? false
    : await getFromLocalsStorageOrCallApiBoolean("isDev", "");
}

export async function getFunds(uid: string): Promise<number> {
  return uid === ""
    ? 0
    : await getFromLocalsStorageOrCallApiNumber("funds", "");
}

export async function canCreateAuction(uid: string): Promise<boolean> {
  return uid === ""
    ? false
    : await getFromLocalsStorageOrCallApiBoolean("canCreateAuction", "");
}

export interface IBidResponse
{
  error? : string,
  success?: boolean
}

interface IBidRequest{
  user: string,
  bid: number, // without tax
  auctionid: string,
  time: Date
}

export async function bid(uid: string, bid: number, auctionid: string) : Promise<IBidResponse>{
  if(uid === "" || auctionid === ""){
    return {error:"Please assure you're logged in and selected a valid auction."}
  }

  let resp = await axios.post(`auction/bid/${auctionid}`,{user:uid, bid: bid, auctionid:auctionid, time: new Date()} as IBidRequest,{proxy:{
    host:"localhost",
    port:9898
  }})

  let bidResponse = resp.data

  return bidResponse
}

async function getFromLocalsStorageOrCallApiNumber(
  itemName: string,
  apipath: string
) :Promise<number> {
  let storageItem = localStorage.getItem(itemName);

  if (storageItem === null) {
    // make call to api and await it
    let response = "0";
    localStorage.setItem(itemName, response);

    return parseFloat(response);
  }

  return parseFloat(storageItem);
}

async function getFromLocalsStorageOrCallApiBoolean(
  itemName: string,
  apipath: string
): Promise<boolean> {
  let storageItem = localStorage.getItem(itemName);

  if (storageItem === null) {
    // make call to api and await it
    let response = "false";
    localStorage.setItem(itemName, response);

    return response === "true";
  }

  return storageItem === "true";
}
