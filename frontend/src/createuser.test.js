import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateUser from './createuser';

describe('CreateUser component', () => {
  test('renders the CreateUser component', () => {
    render(<CreateUser />);
    const usernameInput = screen.getByPlaceholderText(/Username/i);
    // const passwordInput = screen.getByLabelText(/Password/i);
    // const confirmPasswordInput = screen.getByLabelText(/Re-type Password/i);
    const passwordInput = screen.getByTestId("password-input");
    const confirmPasswordInput = screen.getByTestId("password2-input");
    const submitButton = screen.getByText(/Sign Up/i);

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  //correct login simulation
  //leave values as they are
  test('renders username input field and simulates typing', () => {
      render(<CreateUser />);
  
      // Check if the username input field is present
      const usernameInput = screen.getByPlaceholderText(/Username/i);
      expect(usernameInput).toBeInTheDocument();
  
      // Simulate typing into the username input field
      fireEvent.change(usernameInput, { target: { value: 'testUser' } });
  
      // Check if the value has been updated
      expect(usernameInput.value).toBe('testUser');
  });

  //password input
  //leave values as they are
  test('renders password input field and simulates typing', () => {
     render(<CreateUser />);

      // Check if the password input field is present
      const passwordInputs = screen.getAllByPlaceholderText(/Password/i);
      passwordInputs.forEach((passwordInput) => {
          expect(passwordInput).toBeInTheDocument();
      });
  
      // Simulate typing into the first password input
      fireEvent.change(passwordInputs[0], { target: { value: 'testPassword' } });
  
      // Check if the value has been updated
      expect(passwordInputs[0].value).toBe('testPassword');
  }
  );
      //confirm password input
    //leave values as they are
    test('renders confirm password input field and simulates typing', () => {
      render(<CreateUser />);

  
      // Check if the confirm password input field is present
      const confirmPasswordInput = screen.getByPlaceholderText(/Re-type Password/i);
      expect(confirmPasswordInput).toBeInTheDocument();
  
      // Simulate typing into the confirm password input field
      fireEvent.change(confirmPasswordInput, { target: { value: 'testPassword' } });
  
      // Check if the value has been updated
      expect(confirmPasswordInput.value).toBe('testPassword');
  });

  //Navigation test
  //navigating to the login page
      test('navigates to login page when clicking the login link', () => {
        render(<CreateUser />);

    
        // Assuming you have a button with the text "Login"
        const loginButton = screen.getByText(/Sign Up/i);
        expect(loginButton).toBeInTheDocument();
    
        // Simulate clicking the login button
        fireEvent.click(loginButton);
        expect(window.location.pathname).toBe('/');
    });


  //unsatisfied login credentials detection
  test('handles password mismatch', async () => {
    render(<CreateUser />);

    // Fill out the form with mismatched passwords
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'testpassword' } });
    fireEvent.change(screen.getByPlaceholderText(/Re-type Password/i), { target: { value: 'mismatchedpassword' } });

    // Submit the form
    fireEvent.click(screen.getByText(/Sign Up/i));

    // Wait for the error message
    await waitFor(() => {
      const errorMessage = screen.getByText(/Passwords dont match/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
