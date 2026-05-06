# User Dashboard

A modern and responsive User Dashboard application built with Angular 17. This project demonstrates frontend engineering concepts including component-based architecture, lazy loading, dynamic component rendering, pagination, filtering, reactive state management, and data visualization using Chart.js.

## Features

* User listing dashboard
* Search and filtering functionality
* Pagination support
* Dynamic Add User modal
* Lazy-loaded form module
* Pie chart visualization using Chart.js
* Responsive UI design
* Standalone Angular components
* Reactive user state management

## Tech Stack

* Angular 17
* TypeScript
* SCSS
* RxJS
* Chart.js

## Project Structure

```bash
src/app/
├── models/
│   └── user.model.ts
├── services/
│   └── user.service.ts
├── user-dashboard/
│   ├── user-dashboard.component.ts
│   ├── user-dashboard.component.html
│   └── user-dashboard.component.scss
├── user-form/
│   ├── user-form.component.ts
│   ├── user-form.component.html
│   ├── user-form.component.scss
│   └── user-form.module.ts
├── app.component.ts
├── app.config.ts
└── app.routes.ts
```

## Installation

### Prerequisites

Make sure you have the following installed:

* Node.js (v18 or later recommended)
* npm
* Angular CLI

Install Angular CLI globally:

```bash
npm install -g @angular/cli
```

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd User-Dashboard-main
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
cd ./user-dashboard
npm install
npm start
```

Then open:

```bash
http://localhost:4200/
```

## Build Project

To create a production build:

```bash
cd ./user-dashboard
npm run build
```

The build artifacts will be generated in the `dist/` directory.

## Run Unit Tests

```bash
ng test
```

## Key Functionalities

### User Search & Filtering

Users can search records by:

* Name
* Email
* Role

### Pagination

The dashboard supports client-side pagination with configurable page size.

### Dynamic Component Loading

The Add User form is loaded dynamically using Angular lazy loading and dynamic component rendering.

### Data Visualization

A responsive pie chart displays user role distribution using Chart.js.

## Performance Optimizations

* Lazy-loaded form module
* Dynamic imports for Chart.js
* Efficient state updates with RxJS
* Standalone Angular components

## Future Improvements

* Backend API integration
* Authentication & authorization
* Edit/Delete user functionality
* Server-side pagination
* Dark mode support
* Advanced analytics dashboard

## Author

Sandeep Kumar

## License

This project is licensed under the MIT License.
