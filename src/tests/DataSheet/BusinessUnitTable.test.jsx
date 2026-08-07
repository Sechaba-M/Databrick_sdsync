import { render, screen } from "@testing-library/react";
import BusinessUnitTable from "../../components/DataSheet/BusinessUnitTable";

describe("BusinessUnitTable", () => {
  test("returns null when no units are provided", () => {
    const { container } = render(<BusinessUnitTable units={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test("renders table headers", () => {
    render(
      <BusinessUnitTable
        units={[{ unit: "Lab", usage: "Testing" }]}
      />
    );

    expect(screen.getByText("Unit")).toBeInTheDocument();
    expect(screen.getByText("Usage")).toBeInTheDocument();
  });

  test("renders business unit rows", () => {
    render(
      <BusinessUnitTable
        units={[
          { unit: "Lab", usage: "Testing" },
          { unit: "Manufacturing", usage: "Production" },
        ]}
      />
    );

    expect(screen.getByText("Lab")).toBeInTheDocument();
    expect(screen.getByText("Testing")).toBeInTheDocument();
    expect(screen.getByText("Manufacturing")).toBeInTheDocument();
    expect(screen.getByText("Production")).toBeInTheDocument();
  });
});
