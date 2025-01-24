export class MaxDistanceExceededError extends Error {
  constructor() {
    super("You are too far away from the venue to place an order, make sure it's within 2km.");
    this.name = "MaxDistanceExceededError";
  }
}
