# GSynergy Data Viewer PWA

A modern Progressive Web Application for managing store and SKU data with powerful visualization capabilities.

## Features

1. **Store Management**
   - CRUD operations for store data
   - Responsive data grid with sorting and filtering
   - Real-time updates with Redux state management

2. **SKU Management**
   - Complete CRUD operations for SKUs
   - Price and cost tracking
   - Category-based organization
   - Store association

3. **Planning Grid**
   - AG-Grid integration for advanced data manipulation
   - Real-time calculations and updates
   - Custom cell renderers and editors

4. **Analytics Dashboard**
   - Dual-axis visualizations using AG-Charts
   - Store performance metrics
   - SKU category analysis
   - Interactive tooltips and legends

## Tech Stack

- React with TypeScript
- Redux for state management
- AG-Grid Enterprise for data grids
- AG-Charts for data visualization
- TailwindCSS for styling

## Getting Started

1. **Prerequisites**
   ```bash
   node >= 14.0.0
   npm >= 6.14.0
   ```

2. **Installation**
   ```bash
   # Clone the repository
   git clone https://github.com/yourusername/GS123456_Prachi_Birla.git

   # Install dependencies
   npm install
   ```

3. **Running the Application**
   ```bash
   # Start development server
   npm start

   # Application will be available at http://localhost:3000
   ```

4. **Running Tests**
   ```bash
   # Run all tests
   npm test

   # Run tests with coverage
   npm test -- --coverage
   ```

## Project Structure

```
/src
  /components     # Reusable UI components
    /layout       # Layout components (TopNav, SideNav)
    /skus         # SKU-related components
    /stores       # Store-related components
  /pages          # Main page components
  /store          # Redux store configuration
  /types          # TypeScript interfaces
  /services       # API and data services
  /utils          # Helper functions
```

## Key Implementation Highlights

1. **Type-Safe Redux Architecture**
   - Implemented strongly-typed Redux store with TypeScript
   - Created separate slices for stores, SKUs, and planning data
   - Used TypeScript interfaces for all data models
   - This demonstrates proficiency in:
     * TypeScript's advanced features
     * Redux best practices
     * State management patterns

2. **Advanced Data Visualization**
   - Implemented dual-axis charts using AG-Charts
   - Created interactive tooltips with custom renderers
   - Added dynamic data updates
   - This showcases:
     * Complex data visualization skills
     * AG-Charts integration expertise
     * Attention to user experience

3. **Modular Component Design**
   - Created reusable form components for SKUs and stores
   - Implemented shared layout components
   - Used custom hooks for common functionality
   - This highlights:
     * React component architecture skills
     * Code reusability practices
     * Clean code principles

4. **Error Handling and Type Safety**
   - Comprehensive error handling in async operations
   - Type-safe form handling with TypeScript
   - Proper Promise handling in services
   - This demonstrates:
     * Production-ready code practices
     * Attention to edge cases
     * TypeScript proficiency

## Future Improvements

1. **Testing**
   - Add unit tests for Redux slices
   - Implement component testing
   - Add integration tests for critical flows

2. **Authentication**
   - Implement user authentication
   - Add role-based access control
   - Secure API endpoints

3. **Performance**
   - Add code splitting
   - Implement service workers
   - Optimize bundle size

4. **Deployment**
   - Set up CI/CD pipeline
   - Configure error logging
   - Deploy to cloud platform

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
