import axios  from "axios";

export interface Crypto {
    id: number
    name: string
    symbol: string
    price: number
}

export const fetchAllCoins = async () => {
    const response = await axios.get('http://localhost:8080/v1/coins/searchAll')
    console.log(response.data)
    return response.data
}