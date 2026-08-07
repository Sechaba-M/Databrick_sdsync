import { render, screen, fireEvent } from "@testing-library/react";
import PaginationControls from "../../components/AdminHome/PaginationControls";

describe("PaginationControls", () => {
  test("does not render when totalPages <= 1", () => {
    const { container } = render(
      <PaginationControls currentPage={1} totalPages={1} onPageChange={jest.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  test("renders page numbers and ellipsis", () => {
    render(
      <PaginationControls currentPage={5} totalPages={10} onPageChange={jest.fn()} />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getAllByText("...").length).toBeGreaterThan(0);
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  test("calls onPageChange when page button is clicked", () => {
    const onPageChange = jest.fn();

    render(
      <PaginationControls currentPage={2} totalPages={5} onPageChange={onPageChange} />
    );

    fireEvent.click(screen.getByText("3"));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  test("previous and next buttons work", () => {
  const onPageChange = jest.fn();

  render(
    <PaginationControls
      currentPage={2}
      totalPages={5}
      onPageChange={onPageChange}
    />
  );

  const buttons = screen.getAllByRole("button");

  const prevButton = buttons[0]; 
  const nextButton = buttons[buttons.length - 1]; 

  fireEvent.click(prevButton);
  fireEvent.click(nextButton);

  expect(onPageChange).toHaveBeenCalledWith(1);
  expect(onPageChange).toHaveBeenCalledWith(3);
});

});
