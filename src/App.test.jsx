import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import {WishlistProvider} from "./components/wishlistContext.jsx";

beforeEach(() => {
  localStorage.removeItem("wishlist");
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({ok: true, json: () => Promise.resolve([])})
  );
});

function renderApp() {
  render(
    <WishlistProvider>
      <App/>
    </WishlistProvider>
  );
}

test("renders the business trips application", () => {
  renderApp();
  expect(screen.getByRole("heading", {name: "Business Trips", level: 1})).toBeInTheDocument();
  expect(screen.getByRole("heading", {name: /My Wishlist/})).toBeInTheDocument();
});

test("shows trips and lets the user add one to the wishlist", async () => {
  const trip = {
    id: 1,
    title: "Berlin Conference",
    description: "Annual team conference",
    startTrip: "2026-12-01",
    endTrip: "2026-12-03",
  };
  globalThis.fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve([trip]),
  });
  const user = userEvent.setup();

  renderApp();

  await user.click(await screen.findByRole("button", {name: "Add to wishlist"}));
  expect(screen.getAllByText("Berlin Conference")).toHaveLength(2);
  expect(screen.getByRole("button", {name: "Added to wishlist"})).toBeDisabled();
});

test("shows an API error and retries the request", async () => {
  globalThis.fetch
    .mockRejectedValueOnce(new Error("API unavailable"))
    .mockResolvedValueOnce({ok: true, json: () => Promise.resolve([])});
  const user = userEvent.setup();

  renderApp();

  expect(await screen.findByRole("alert")).toHaveTextContent("API unavailable");
  await user.click(screen.getByRole("button", {name: "Retry"}));
  expect(await screen.findByText("No business trips available at the moment.")).toBeInTheDocument();
});
