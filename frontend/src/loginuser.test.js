import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginUser from './loginuser';

describe('LoginUser component', () => {
  //rendering test for input fields 
  test('renders the LoginUser component', () => {
    render(<LoginUser />);
    const usernameInput = screen.getByPlaceholderText(/Username/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const loginButton = screen.getByText(/Login/i);

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });



  //Navigation test
  //navigating to the login page
  test('navigates to login page when clicking the login link', () => {
    render(<LoginUser />);

    // Assuming you have a button with the text "Login"
    const loginButton = screen.getByText(/Login/i);
    expect(loginButton).toBeInTheDocument();

    // Simulate clicking the login button
    fireEvent.click(loginButton);
    expect(window.location.pathname).toBe('/');
});
  //simulating usr input test
  test('submits the form and triggers onLoginSuccess on successful login', async () => {
    // Mock the fetch function to simulate a successful response
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue({}),
    });

    // Mock the onLoginSuccess callback
    const mockOnLoginSuccess = jest.fn();

    render(<LoginUser onLoginSuccess={mockOnLoginSuccess} />);

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'testpassword' } });

    // Submit the form
    fireEvent.click(screen.getByText(/Login/i));

    // Wait for the success message
    await waitFor(() => {
      const successMessage = screen.getByText(/Login successfull/i);
      expect(successMessage).toBeInTheDocument();
    });

    // Assert that the onLoginSuccess callback is called
    expect(mockOnLoginSuccess).toHaveBeenCalled();
  });


  //Failed login  attempt test
  test('handles server error and displays error message', async () => {
    // Mock the fetch function to simulate an error response
    global.fetch = jest.fn().mockResolvedValue({
      status: 500,
      json: jest.fn().mockResolvedValue({ error: 'Server error' }),
    });

    render(<LoginUser onLoginSuccess={() => {}} />);

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'testpassword' } });

    // Submit the form
    fireEvent.click(screen.getByText(/Login/i));

    // Wait for the error message
    await waitFor(() => {
      const errorMessage = screen.getByText(/Something went wrong/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

});
