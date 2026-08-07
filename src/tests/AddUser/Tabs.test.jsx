import { render, screen, fireEvent } from "@testing-library/react";
import Tabs from "../../components/AddUser/Tabs";

describe("Tabs", () => {
  it("renders user list and register tabs", () => {
    render(<Tabs activeTab="list" onChange={jest.fn()} userCount={3} />);

    //design separates label and count into different elements
    expect(screen.getByText("User List")).toBeInTheDocument();
    expect(screen.getByText("Register New User")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("calls onChange when a tab is clicked", () => {
    const onChange = jest.fn();

    render(<Tabs activeTab="list" onChange={onChange} />);

    fireEvent.click(screen.getByText("Register New User"));

    expect(onChange).toHaveBeenCalledWith("create");
  });
});
