import { render, screen } from "@testing-library/react";
import SDSection from "../../components/DataSheet/SDSection";

describe("SDSection", () => {
  test("renders title and children", () => {
    render(
      <SDSection title="Test Section">
        <p>Content here</p>
      </SDSection>
    );

    expect(screen.getByText("Test Section")).toBeInTheDocument();
    expect(screen.getByText("Content here")).toBeInTheDocument();
  });

  test("applies custom background class", () => {
    const { container } = render(
      <SDSection title="Custom" bg="bg-red-50">
        Test
      </SDSection>
    );

    expect(container.firstChild).toHaveClass("bg-red-50");
  });
});
