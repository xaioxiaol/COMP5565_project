class Ownership {
    constructor(
      public ownerId: string,
      public transactionDate: number
    ) {}
  
    toJSON(): object {
      return {
        ownerId: this.ownerId,
        transactionDate: this.transactionDate,
      };
    }
  
    static fromJSON(json: any): Ownership {
      return new Ownership(
        json.ownerId,
        json.transactionDate
      );
    }
  }
  
  export default Ownership;