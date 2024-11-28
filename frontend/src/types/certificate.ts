export default class Certificate {
    constructor(
      public certificateId: string,
      public uniqueId: string,
      public batchCode: string,
      public state: string,
      public price: string,
      public description: string,
      public productionDate: Date | string,
      public signature: string
    ) {
      if (!(this.productionDate instanceof Date)) {
        this.productionDate = new Date(this.productionDate);
      }
    }
  
    toJSON() {
      const date = this.productionDate instanceof Date ? 
        this.productionDate : 
        new Date(this.productionDate);

      return {
        certificateId: this.certificateId,
        uniqueId: this.uniqueId,
        batchCode: this.batchCode,
        state: this.state,
        price: this.price,
        description: this.description,
        productionDate: date.toISOString().split('T')[0],
        signature: this.signature
      };
    }
  
    static fromJSON(json: any): Certificate {
      const data = typeof json === 'string' ? JSON.parse(json) : json;
      return new Certificate(
        data.certificateId,
        data.uniqueId,
        data.batchCode,
        data.state,
        data.price,
        data.description,
        new Date(data.productionDate),
        data.signature
      );
    }
}