import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUserApi } from '../../api/api';
import Register from './register';

jest.mock('../../api/api');

describe('Register Component Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render the Register component correctly', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByText('Create your account')).toBeInTheDocument();
  });

  it('Should show validation errors when fields are empty', async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const signUpButton = screen.getByText('Create your account');

    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Phone Number is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(
        screen.getByText('Confirm Password is required')
      ).toBeInTheDocument();
    });
  });

  it('Should show error when password and confirm password do not match', async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput =
      screen.getByPlaceholderText('Confirm Password');
    const signUpButton = screen.getByText('Create your account');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'differentpassword' },
    });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });
  });

  it('Should successfully register when all fields are valid', async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const mockResponse = {
      data: {
        success: true,
        message: 'Registration successful',
      },
    };

    registerUserApi.mockResolvedValue(mockResponse);
    toast.success = jest.fn();

    const fullNameInput = screen.getByPlaceholderText('Full Name');
    const emailInput = screen.getByPlaceholderText('Email');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput =
      screen.getByPlaceholderText('Confirm Password');
    const signUpButton = screen.getByText('Create your account');

    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password123' },
    });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(registerUserApi).toHaveBeenCalledWith({
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
        password: 'password123',
        confirmPassword: 'password123',
      });
      expect(toast.success).toHaveBeenCalledWith('Registration successful');
    });
  });

  it('Should show error when registration fails', async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const mockResponse = {
      data: {
        success: false,
        message: 'Registration failed',
      },
    };

    registerUserApi.mockResolvedValue(mockResponse);
    toast.error = jest.fn();

    const fullNameInput = screen.getByPlaceholderText('Full Name');
    const emailInput = screen.getByPlaceholderText('Email');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput =
      screen.getByPlaceholderText('Confirm Password');
    const signUpButton = screen.getByText('Create your account');

    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password123' },
    });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(registerUserApi).toHaveBeenCalledWith({
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
        password: 'password123',
        confirmPassword: 'password123',
      });
      expect(toast.error).toHaveBeenCalledWith('Registration failed');
    });
  });

  it('Should not call API when validation fails', async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const signUpButton = screen.getByText('Create your account');

    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(registerUserApi).not.toHaveBeenCalled();
    });
  });

  it('Should display social login options', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByAltText('Facebook')).toBeInTheDocument();
    expect(screen.getByAltText('Google')).toBeInTheDocument();
    expect(screen.getByAltText('Twitter')).toBeInTheDocument();
  });
});
