import { render, screen } from "@testing-library/react";
import UserTable from "../../components/AddUser/UserTable";

describe("UserTable", () => {
  it("shows empty state when no users", () => {
    render(
      <UserTable users={[]} onEditUser={jest.fn()} onDeleteUser={jest.fn()} />
    );

    expect(
      screen.getByText(/no users found/i)
    ).toBeInTheDocument();
  });

  it("renders user rows", () => {
    render(
      <UserTable
        users={[
          {
            firstName: "Bob",
            lastName: "Lee",
            username: "blee",
            email: "bob@test.com",
            phone: "555",
          },
        ]}
        onEditUser={jest.fn()}
        onDeleteUser={jest.fn()}
      />
    );

    expect(screen.getByText("Bob Lee")).toBeInTheDocument();
  });
});
