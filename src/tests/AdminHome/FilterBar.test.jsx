import { render, screen, fireEvent } from "@testing-library/react";
import FilterBar from "../../components/AdminHome/FilterBar";

describe("FilterBar", () => {
  test("renders search input and buttons", () => {
    render(
      <FilterBar
        searchValue=""
        onSearchChange={jest.fn()}
        nameFilter="all"
        onNameFilterChange={jest.fn()}
        businessUnitFilter="all"
        onBusinessUnitFilterChange={jest.fn()}
        supplierFilter="all"
        onSupplierFilterChange={jest.fn()}
        onExport={jest.fn()}
        onAddChemical={jest.fn()}
      />
    );

    expect(
      screen.getByPlaceholderText(/search chemical/i)
    ).toBeInTheDocument();

    expect(screen.getByText("Export")).toBeInTheDocument();
    expect(screen.getByText("Add Chemical")).toBeInTheDocument();
  });

  test("calls onSearchChange when typing", () => {
    const onSearchChange = jest.fn();

    render(
      <FilterBar
        searchValue=""
        onSearchChange={onSearchChange}
        nameFilter="all"
        onNameFilterChange={jest.fn()}
        businessUnitFilter="all"
        onBusinessUnitFilterChange={jest.fn()}
        supplierFilter="all"
        onSupplierFilterChange={jest.fn()}
        onExport={jest.fn()}
      />
    );

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "acetone" },
    });

    expect(onSearchChange).toHaveBeenCalledWith("acetone");
  });

  test("calls onExport when Export button is clicked", () => {
    const onExport = jest.fn();

    render(
      <FilterBar
        searchValue=""
        onSearchChange={jest.fn()}
        nameFilter="all"
        onNameFilterChange={jest.fn()}
        businessUnitFilter="all"
        onBusinessUnitFilterChange={jest.fn()}
        supplierFilter="all"
        onSupplierFilterChange={jest.fn()}
        onExport={onExport}
      />
    );

    fireEvent.click(screen.getByText("Export"));
    expect(onExport).toHaveBeenCalled();
  });
});
