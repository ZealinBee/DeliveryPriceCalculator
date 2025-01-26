
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { expect, test, vi, describe } from "vitest";
import DeliveryCalculatorForm from "../../components/DeliveryCalculatorForm";

describe("DeliveryCalculatorForm", () => {
    test("submits form with valid inputs and calculates delivery price", async () => {
        const mockSetPriceBreakdown = vi.fn();
        const mockSetShowPriceBreakdown = vi.fn();

        render(
            <DeliveryCalculatorForm
                setPriceBreakdown={mockSetPriceBreakdown}
                setShowPriceBreakdown={mockSetShowPriceBreakdown}
            />
        );

        fireEvent.change(screen.getByRole('textbox', {name: /venue slug/i}), {
            target: { value: 'home-assignment-venue-helsinki' }
        });
        fireEvent.change(screen.getByRole('textbox', {name: /cart value/i}), {
            target: { value: '12.34' }
        });
        fireEvent.change(screen.getByRole('textbox', {name: /latitude/i}), {
            target: { value: '60.17' }
        });
        fireEvent.change(screen.getByRole('textbox', {name: /longitude/i}), {
            target: { value: '24.93' }
        });

        fireEvent.click(screen.getByRole('button', {name: /calculate delivery price/i}));

        await waitFor(() => {
            expect(mockSetPriceBreakdown).toHaveBeenCalled();
            expect(mockSetShowPriceBreakdown).toHaveBeenCalledWith(true);
        });
    });
});
