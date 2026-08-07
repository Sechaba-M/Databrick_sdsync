# Testing Strategy – SDSync Frontend

This document describes the testing approach used in the SDSync frontend
and explains what is covered, why it is covered, and how tests should be written.

---

## Test Stack

- **Test Runner:** Vitest / Jest
- **Component Testing:** React Testing Library
- **Assertions:** @testing-library/jest-dom
- **Mocking:** vi / jest mocks

---

## Test Structure

Tests are colocated with the code they verify.

```text
src/
├── tests/
│   └── AddNewChemical/
├   ├── └── AddChemicalModal.test.jsx
│   └── AddUser/
│   ├── AdminHome/
├   ├── api/
│   ├── Dashboard/
│   ├── Datasheet/
│   ├── ForgotPassword/
│   ├── MedicalData/
│   ├── Navbar/
│   ├── ProfilePage/
│   ├── ResetPasswordPage/
│   ├── App.test.jsx
│   ├── Login.test.jsx

```
## Test documents

[Api tests document](https://docs.google.com/document/d/1KxmsHv_gaG2uqWlFqezgOXh9a209Fd1u4B3U3ZQsqGI/edit?usp=sharing)

[Components tests document](https://docs.google.com/document/d/1cCrQh9Q6lt6IraVK1qFP5SFUQIIJOjua9K8nyaUZV40/edit?usp=sharing)