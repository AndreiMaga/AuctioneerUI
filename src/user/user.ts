

export interface User{
    uid?: string,
    availableFunds?: number,
    token?: string,
    apikey?: string
}

let currentUser :User = {}

export default currentUser