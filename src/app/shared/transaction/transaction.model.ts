export interface Transaction {
    transaction: string,
    type: string,
    name: string,
    volume: number,
    pricePer: number,
    amount: number,
    date: Date
}