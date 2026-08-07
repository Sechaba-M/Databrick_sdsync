# SDSync – Chemical & Medical Surveillance Frontend

SDSync is a modern React-based web application for managing **chemical inventories, safety data, and medical surveillance** within an organization. The frontend is designed to integrate with a data-driven backend (Parquet / API-based) and focuses on clarity, compliance, and usability for admins, health practitioners, and operational users.

Think of it as the control room for chemicals — minus the blinking red self-destruct button.

---

## Features

### Chemical Management

* View and manage registered chemicals
* Supports chemistry-specific fields:

  * CAS Number
  * Molecular Formula
  * Molecular Mass
  * InChI / SMILES (where available)
* Risk level classification
* Supplier and business unit assignment

### Medical Surveillance

* Chemical-linked medical surveillance tables
* Regulatory and occupational exposure limits (OELs):

  * TWA, STEL, Ceiling
  * Skin notation support
* Biological monitoring tests
* Examination frequency tracking
* Fully responsive (desktop + mobile)

### Search & Filtering

* Chemical search and filtering
* Risk-based filtering
* Unit / category segmentation

### Responsive UI

* Desktop data tables
* Mobile-friendly card layouts
* Consistent UX across views

---

## Tech Stack

* **React** (Vite-powered)
* **JavaScript (ES6+)**
* **Tailwind CSS**
* **Fetch API** for backend integration

---

## Project Structure

```text
src/
├── api/
│   └── chemicalApi.js        # API calls
├── components/
│   ├── Admin/
│   ├── MedicalData/
│   │   └── ChemicalSurvTable.jsx
│   └── Shared/
├── pages/
│   ├── AdminChemicalDashboardPage.jsx
│   └── MedicalSurveillancePage.jsx
├── utils/
└── main.jsx
```

---

## Data Normalization

The backend provides chemistry data using **snake_case** fields (e.g. `molecular_formula`).

To avoid rewriting UI components, all backend responses are **normalized** in:

```text
src/api/chemicalApi.js
```

### Example normalization output

```js
{
  id,
  name,
  casNumber,
  molecularFormula,
  molecularMass,
  riskLevel,
  hazards,
  monitoringType,
  supplier,
  businessUnits,
  icons,
}
```

This ensures:

* UI components stay clean
* Backend changes don’t break the frontend
* New chemical fields can be added safely

---

## Medical Surveillance Data Model

The `ChemicalSurvTable` component supports both **legacy** and **structured** regulatory data.

### Example

```js
{
  chemical: "Benzene",
  cas: "71-43-2",
  molecularFormula: "C6H6",
  molecularMass: 78.11,
  risk: "High Risk",
  oels: {
    twa: "1 ppm",
    stel: "5 ppm",
    ceiling: null,
    skin: true,
  },
  limits: ["TWA 1 ppm"],
}
```

Structured OELs are displayed when present, with automatic fallback to legacy string limits.

---

## Running the Project Locally

### Running Tests

This project includes automated test cases to ensure core functionality remains stable as features evolve.

#### Test stack

* **Vitest / Jest** (depending on configuration)
* **React Testing Library** for component testing

#### Run all tests

```bash
npm run test
```

#### Watch mode 

```bash
npm run test:watch
```

#### Coverage report 

```bash
npm run test:coverage
```

---

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

The app will be available at:

```text
http://localhost:5173
```

---

## Authentication

API requests use an auth header helper (`withAuthHeaders`).

Ensure your backend provides:

* Valid JWT or token-based authentication
* CORS access for the frontend domain

---

## Design Philosophy

* **Data-first**: UI reflects real chemical data, not placeholders
* **Fail-soft**: Missing backend fields never crash the UI
* **Composable**: Components are reusable and extendable
* **Regulation-aware**: Built with occupational health & safety workflows in mind

---

## Future Improvements

* Chemical structure visualization (SMILES → SVG)
* Role-based access control (Admin / Practitioner / User)
* Audit logs for chemical changes
* Export to PDF / Excel
* Dashboard analytics

---

## License

This project is proprietary and intended for internal or authorized use only.

---

