# GSynergy Data Viewer PWA

## Instructions to Run and Test the Code

1. **Installation**
   ```bash
   npm install
   ```

2. **Running the Application**
   ```bash
   npm start
   ```
   This will start the development server at http://localhost:3000

3. **Running Tests**
   ```bash
   npm test
   ```

## Well-Implemented Elements

1. **Redux State Management with TypeScript**
   - Implemented strongly-typed Redux store with separate slices for Stores, SKUs, and Planning data
   - Used TypeScript interfaces for all data models ensuring type safety
   - Implemented efficient state updates with proper immutability patterns
   - This demonstrates my proficiency in both Redux and TypeScript, showing how I maintain type safety while managing complex application state

2. **Modular Component Architecture**
   - Created reusable layout components (TopNav, SideNav)
   - Implemented lazy loading for page components to improve initial load time
   - Maintained clear separation of concerns between components
   - This showcases my ability to structure scalable React applications with performance in mind

3. **Clean and Maintainable Code Structure**
   - Organized project structure with clear separation of components, pages, and store
   - Consistent file naming and code formatting
   - Well-documented code with clear type definitions
   - This demonstrates my focus on code quality and maintainability

## Future Improvements (With 4 More Hours)

1. **Comprehensive Testing Suite**
   - Add unit tests for Redux reducers and actions
   - Implement component testing with React Testing Library
   - Add integration tests for critical user flows
   Why? Testing is crucial for production applications, ensuring reliability and making future changes safer.

2. **Enhanced User Experience**
   - Add loading states and error handling
   - Implement drag-and-drop for store reordering
   - Add form validation and error messages
   Why? These features would make the application more user-friendly and robust in handling edge cases.

3. **Performance Optimizations**
   - Implement memoization for expensive calculations in the Planning grid
   - Add service worker for offline capabilities
   - Optimize bundle size with code splitting
   Why? These improvements would make the application faster and more reliable, especially for larger datasets.

## Challenge Feedback

- The requirements are well-structured and clear
- The scope is appropriate for assessing both technical skills and architectural decisions
- The challenge effectively tests real-world scenarios a developer might encounter
- Suggestion: Could include some sample data to standardize the testing/demo process
