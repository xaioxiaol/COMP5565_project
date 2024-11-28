class Certificate {
    constructor(
      public certificateId: string,
      public uniqueId: string,
      public batchCode: string,
      public state: string,
      public price: string,
      public description: string,
      public productionDate: number,
      public signature: string
    ) {}
  
    toJSON(): object {
      return {
        certificateId: this.certificateId,
        uniqueId: this.uniqueId,
        batchCode: this.batchCode,
        state: this.state,
        price: this.price,
        description: this.description,
        productionDate: this.productionDate,
        signature: this.signature,
      };
    }
  
    static fromJSON(json: any): Certificate {
      return new Certificate(
        json.certificateId,
        json.uniqueId,
        json.batchCode,
        json.state,
        json.price,
        json.description,
        json.productionDate,
        json.signature
      );
    }
}
export default Certificate;