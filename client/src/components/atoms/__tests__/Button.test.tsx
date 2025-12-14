/**
 * Button Component Tests
 *
 * Tests the Button atom component with its variants and states.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button";

describe("Button", () => {
  // ============================================================
  // Rendering Tests
  // ============================================================

  describe("rendering", () => {
    it("renders children text", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button")).toHaveTextContent("Click me");
    });

    it("renders as a button element", () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  // ============================================================
  // Variant Tests
  // ============================================================

  describe("variants", () => {
    it("applies primary variant styles by default", () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-indigo-600");
      expect(button).toHaveClass("text-white");
    });

    it("applies secondary variant styles", () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-gray-100");
      expect(button).toHaveClass("text-gray-700");
    });
  });

  // ============================================================
  // Interaction Tests
  // ============================================================

  describe("interactions", () => {
    it("calls onClick when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Click</Button>);

      await user.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      );

      await user.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // ============================================================
  // State Tests
  // ============================================================

  describe("states", () => {
    it("is disabled when disabled prop is true", () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("is enabled by default", () => {
      render(<Button>Enabled</Button>);
      expect(screen.getByRole("button")).toBeEnabled();
    });
  });

  // ============================================================
  // Props Forwarding Tests
  // ============================================================

  describe("props forwarding", () => {
    it("forwards additional className", () => {
      render(<Button className="custom-class">Custom</Button>);
      expect(screen.getByRole("button")).toHaveClass("custom-class");
    });

    it("forwards type attribute", () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    it("forwards aria attributes", () => {
      render(<Button aria-label="Close dialog">×</Button>);
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "Close dialog"
      );
    });
  });
});

