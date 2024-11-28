class Ownership {
    constructor(
        public uniqueId: string,
        public ownerId: string,
        public transactionDate: number
    ) { }

    toJSON(): object {
        return {
            uniqueId: this.uniqueId,
            ownerId: this.ownerId,
            transactionDate: this.transactionDate,
        };
    }

    static fromJSON(json: any): Ownership {
        return new Ownership(
            json.uniqueId,
            json.ownerId,
            json.transactionDate
        );
    }
}

export default Ownership;