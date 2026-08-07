import { render, screen } from "@testing-library/react";
import UserList from "../../components/AddUser/UserList";

describe("UserList", () => {
  it("renders registered users heading", () => {
    render(
      <UserList users={[]} onEditUser={jest.fn()} onDeleteUser={jest.fn()} />
    );

    expect(
      screen.getByText("Registered Users")
    ).toBeInTheDocument();
  });
});
