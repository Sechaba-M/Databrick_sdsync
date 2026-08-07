import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserForm from "../../components/AddUser/UserForm";

describe("UserForm", () => {
  const mockBusinessUnits = [
    { id: "1", name: "Manufacturing" },
    { id: "2", name: "Engineering" },
    { id: "3", name: "Quality Assurance" },
  ];

  it("renders create user form", () => {
    render(<UserForm onSubmit={jest.fn()} />);

    expect(
      screen.getByText("Register New User")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /create user profile/i })
    ).toBeInTheDocument();
  });

  it("auto-generates username from first and last name", () => {
    render(<UserForm onSubmit={jest.fn()} />);

    const firstNameInput = screen.getByPlaceholderText("Enter first name");
    const lastNameInput = screen.getByPlaceholderText("Enter last name");
    const usernameInput = screen.getByPlaceholderText("Auto-generated from name");

    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });

    expect(usernameInput).toHaveValue("johndoe");
  });

  it("removes spaces from username", () => {
    render(<UserForm onSubmit={jest.fn()} />);

    const firstNameInput = screen.getByPlaceholderText("Enter first name");
    const lastNameInput = screen.getByPlaceholderText("Enter last name");
    const usernameInput = screen.getByPlaceholderText("Auto-generated from name");

    fireEvent.change(firstNameInput, { target: { value: "Mary Jane" } });
    fireEvent.change(lastNameInput, { target: { value: "Van Der Berg" } });

    expect(usernameInput).toHaveValue("maryjanevanderberg");
  });

  it("auto-generates password for new users", () => {
    render(<UserForm onSubmit={jest.fn()} />);

    const passwordInput = screen.getByPlaceholderText("Auto-generated password");
    
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput.value).not.toBe("");
    expect(passwordInput.value.length).toBeGreaterThan(10);
  });

  it("does not show password field in edit mode", () => {
    render(
      <UserForm
        isEditing
        onSubmit={jest.fn()}
        initialValues={{ firstName: "Test" }}
      />
    );

    expect(
      screen.queryByPlaceholderText("Auto-generated password")
    ).not.toBeInTheDocument();
  });

  it("toggles permissions on click", () => {
    render(<UserForm onSubmit={jest.fn()} />);

    const readCheckbox = screen.getByRole("checkbox", { name: /read/i });
    const writeCheckbox = screen.getByRole("checkbox", { name: /write/i });

    expect(readCheckbox).not.toBeChecked();
    expect(writeCheckbox).not.toBeChecked();

    fireEvent.click(readCheckbox);
    expect(readCheckbox).toBeChecked();

    fireEvent.click(writeCheckbox);
    expect(writeCheckbox).toBeChecked();

    // Uncheck
    fireEvent.click(readCheckbox);
    expect(readCheckbox).not.toBeChecked();
  });

  it("submits form data with all fields", () => {
    const onSubmit = jest.fn();
    render(
      <UserForm 
        onSubmit={onSubmit} 
        businessUnits={mockBusinessUnits}
      />
    );

    fireEvent.change(
      screen.getByPlaceholderText("Enter first name"),
      { target: { value: "Jane" } }
    );
    fireEvent.change(
      screen.getByPlaceholderText("Enter last name"),
      { target: { value: "Smith" } }
    );
    fireEvent.change(
      screen.getByPlaceholderText("user@company.com"),
      { target: { value: "jane.smith@company.com" } }
    );
    fireEvent.change(
      screen.getByPlaceholderText("+1-123-1456"),
      { target: { value: "+1-555-0100" } }
    );

    // Use getLabelText to find the selects by their labels
    const businessUnitSelect = screen.getByLabelText(/business unit/i);
    const roleSelect = screen.getByLabelText(/user role/i);
    
    fireEvent.change(businessUnitSelect, { target: { value: "Manufacturing" } });
    // Valid role options are "Admin" or "Viewer"
    fireEvent.change(roleSelect, { target: { value: "Admin" } });

    fireEvent.click(screen.getByRole("checkbox", { name: /read/i }));

    fireEvent.click(
      screen.getByRole("button", { name: /create user profile/i })
    );

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: "Jane",
        lastName: "Smith",
        username: "janesmith",
        email: "jane.smith@company.com",
        phone: "+1-555-0100",
        businessUnit: "Manufacturing",
        role: "Admin",
        permissions: ["read"],
      })
    );
  });

  it("shows cancel edit button in edit mode", () => {
    render(
      <UserForm
        isEditing
        onSubmit={jest.fn()}
        onCancelEdit={jest.fn()}
        initialValues={{ firstName: "Test" }}
      />
    );

    expect(
      screen.getByRole("button", { name: /cancel edit/i })
    ).toBeInTheDocument();
  });

  it("does not show cancel button in create mode", () => {
    render(<UserForm onSubmit={jest.fn()} />);

    expect(
      screen.queryByRole("button", { name: /cancel edit/i })
    ).not.toBeInTheDocument();
  });

  it("calls onCancelEdit when cancel button is clicked", () => {
    const onCancelEdit = jest.fn();
    
    render(
      <UserForm
        isEditing
        onSubmit={jest.fn()}
        onCancelEdit={onCancelEdit}
        initialValues={{ firstName: "Test" }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /cancel edit/i }));

    expect(onCancelEdit).toHaveBeenCalledTimes(1);
  });

  it("populates form with initial values in edit mode", () => {
    const initialValues = {
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      email: "john.doe@company.com",
      phone: "+1-555-1234",
      businessUnit: "Manufacturing",
      role: "Admin",
      permissions: ["read", "write"],
    };

    render(
      <UserForm
        isEditing
        onSubmit={jest.fn()}
        initialValues={initialValues}
        businessUnits={mockBusinessUnits}
      />
    );

    expect(screen.getByPlaceholderText("Enter first name")).toHaveValue("John");
    expect(screen.getByPlaceholderText("Enter last name")).toHaveValue("Doe");
    expect(screen.getByPlaceholderText("Auto-generated from name")).toHaveValue("johndoe");
    expect(screen.getByPlaceholderText("user@company.com")).toHaveValue("john.doe@company.com");
    expect(screen.getByPlaceholderText("+1-123-1456")).toHaveValue("+1-555-1234");
    
    expect(screen.getByRole("checkbox", { name: /read/i })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /write/i })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /admin/i })).not.toBeChecked();
  });

  it("shows save changes button text in edit mode", () => {
    render(
      <UserForm
        isEditing
        onSubmit={jest.fn()}
        initialValues={{ firstName: "Test" }}
      />
    );

    expect(
      screen.getByRole("button", { name: /save changes/i })
    ).toBeInTheDocument();
  });

  it("disables submit button when loading", () => {
    render(<UserForm onSubmit={jest.fn()} loading={true} />);

    const submitButton = screen.getByRole("button", { name: /saving/i });
    
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent("Saving...");
  });

  it("username is readonly in create mode", () => {
    render(<UserForm onSubmit={jest.fn()} />);

    const usernameInput = screen.getByPlaceholderText("Auto-generated from name");
    
    expect(usernameInput).toHaveAttribute("readonly");
  });

  it("loads business units into select dropdown", () => {
    render(
      <UserForm 
        onSubmit={jest.fn()} 
        businessUnits={mockBusinessUnits}
      />
    );

    const businessUnitSelect = screen.getByLabelText(/business unit/i);
    
    // Check that all business units are present as options
    expect(businessUnitSelect).toContainHTML('<option value="Manufacturing">Manufacturing</option>');
    expect(businessUnitSelect).toContainHTML('<option value="Engineering">Engineering</option>');
    expect(businessUnitSelect).toContainHTML('<option value="Quality Assurance">Quality Assurance</option>');
  });

  it("shows loading state for business units", () => {
    render(
      <UserForm 
        onSubmit={jest.fn()} 
        businessUnits={[]}
        loadingBusinessUnits={true}
      />
    );

    const businessUnitSelect = screen.getByLabelText(/business unit/i);
    
    expect(businessUnitSelect).toBeDisabled();
    expect(businessUnitSelect).toContainHTML('<option value="">Loading...</option>');
  });
});