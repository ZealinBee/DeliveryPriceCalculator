export const calculateSmallOrderSurcharge = (cartValueInCents: number, orderMinimumNoSurcharge: number): number => {
    let smallOrderSurcharge = 0;
    if (cartValueInCents < orderMinimumNoSurcharge) {
        smallOrderSurcharge = orderMinimumNoSurcharge - cartValueInCents;
    }
    return smallOrderSurcharge;
}