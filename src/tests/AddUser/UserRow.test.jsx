import { render, screen, fireEvent } from "@testing-library/react";
import UserRow from "../../components/AddUser/UserRow";

const user = {
  firstName: "Alice",
  lastName: "Smith",
  username: "asmith",
  email: "alice@test.com",
  phone: "123456",
  permissions: ["read", "write"],
};

describe("UserRow", () => {
  it("renders user data", () => {
    render(
      <table>
        <tbody>
          <UserRow user={user} index={0} onEdit={jest.fn()} onDelete={jest.fn()} />
        </tbody>
      </table>
    );

    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("asmith")).toBeInTheDocument();
    expect(screen.getByText("read")).toBeInTheDocument();
  });

  it("calls edit and delete handlers", () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(
      <table>
        <tbody>
          <UserRow user={user} index={0} onEdit={onEdit} onDelete={onDelete} />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByText("Delete"));

    expect(onEdit).toHaveBeenCalledWith(user);
    expect(onDelete).toHaveBeenCalledWith(user);
  });
});
