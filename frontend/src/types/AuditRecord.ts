class AuditRecord {
    constructor(
      public actorId: string,
      public uniqueId: string,
      public batchCode: string,
      public role: string,
      public timestamp: string
    ) {}
  
    toJSON(): object {
      return {
        actorId: this.actorId,
        uniqueId: this.uniqueId,
        batchCode: this.batchCode,
        role: this.role,
        timestamp: this.timestamp,
      };
    }
  
    static fromJSON(json: any): AuditRecord {
      return new AuditRecord(
        json.actorId,
        json.uniqueId,
        json.batchCode,
        json.role,
        json.timestamp
      );
    }
}
export default AuditRecord;
