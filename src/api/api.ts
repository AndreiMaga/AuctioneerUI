import axios, { AxiosResponse } from "axios";

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

export interface IBidResponse {
  error?: string;
  success: boolean;
}

interface IBidRequest {
  user: string;
  bid: string; // without tax
  auctionid: string;
  time: number;
}

export async function bid(
  uid: string,
  bid: string,
  auctionid: string
): Promise<IBidResponse> {
  if (uid === "" || auctionid === "") {
    return {
      error: "Please assure you're logged in and selected a valid auction.",
      success: false
    };
  }

  let req: IBidRequest = {
    user: uid,
    bid: bid,
    auctionid: auctionid,
    time: Date.now(),
  };

  await axios
    .post(`http://localhost:9897/auction/bid/${auctionid}`, req)
    .then((resp: AxiosResponse<any, any>) => {
      console.log(resp.data as IBidResponse);
    })
    .catch((e) => console.error(e));


  return {success: false};
}

async function getFromLocalsStorageOrCallApiNumber(
  itemName: string,
  apipath: string
): Promise<number> {
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
