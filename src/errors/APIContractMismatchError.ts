export class APIContractMismatchError extends Error {
  constructor() {
    super("API contract mismatch");
    this.name = "APIContractMismatchError";
  }
}
