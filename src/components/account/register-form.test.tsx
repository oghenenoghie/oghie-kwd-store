import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterForm } from "./register-form";
import { ApiError } from "@/lib/api/client";

const pushMock = vi.fn();
const registerMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({ register: registerMock }),
}));

describe("RegisterForm", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("submits username, email, and password, then redirects home", async () => {
    registerMock.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/username/i), "jane");
    await user.type(screen.getByLabelText(/email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "hunter2!!");
    await user.type(screen.getByLabelText(/confirm password/i), "hunter2!!");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        username: "jane",
        email: "jane@example.com",
        password: "hunter2!!",
      });
    });
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("blocks submission when the passwords don't match", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/username/i), "jane");
    await user.type(screen.getByLabelText(/email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "hunter2!!");
    await user.type(screen.getByLabelText(/confirm password/i), "different");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    expect(registerMock).not.toHaveBeenCalled();
  });

  it("surfaces the backend's field error instead of a generic message", async () => {
    registerMock.mockRejectedValue(
      new ApiError("Bad Request", 400, { username: ["This field is required."] }),
    );
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "hunter2!!");
    await user.type(screen.getByLabelText(/confirm password/i), "hunter2!!");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText(/this field is required/i)).toBeInTheDocument();
  });
});
