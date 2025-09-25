# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Development Commands

### Core Development

- `npm run dev` - Start development server (React Router v7)
- `npm run validate` - Run typecheck, build, lint, and export routes (full validation)
- `npm run typecheck` - Run TypeScript type checking and generate route types
- `npm run lint` - Run ESLint
- `npm test` - Run Playwright tests

### Testing & Validation

- `npm run test:ui` - Run Playwright tests with UI interface
- `npm run check` - Quick typecheck (alias for typecheck)
- `npm run prettier` - Format code with Prettier

### Route Management

- `npm run routes` - List all application routes
- `npm run routes:json` - Export routes to JSON format

**IMPORTANT**: Always run `npm run typecheck` after adding/renaming routes to generate route types, or if you see
missing `./+types/[routeName]` import errors.

## Architecture Overview

### State Management Architecture

**Context/Provider Pattern** (3-file structure):

- `*-context.ts` - React context creation with TypeScript
- `*-provider.tsx` - Provider component with business logic
- `use*Context.ts` - Consumer hook with validation

**Complex State (Filters/Search)**:

- Reducer pattern with Immer for immutable updates
- Actions/types separation (`store/` directory)
- localStorage persistence via localforage
- URL search params integration
- Debounced search (400ms standard)

### API Integration Pattern

**React Query + OpenAPI**:

- Domain-organized hooks (`app/react-query/`)
- OpenAPI client with full TypeScript inference
- Standardized query/mutation patterns with consumer overrides
- Hierarchical cache keys for efficient invalidation
- Authentication via Clerk tokens

### Authentication & Permissions

- **Clerk Authentication** with organization-based permissions
- Role-based access (Admin/Member/Viewer) with granular permissions
- Server-side auth validation in loaders
- Public metadata for superuser status

## Key Development Patterns

### Route Development

```tsx
// Always use generated types
import type { Route } from "./+types/route-name";

export async function loader({ params }: Route.LoaderArgs) {
  // Server-side data loading
}

export default function Component({ loaderData }: Route.ComponentProps) {
  // Component with type-safe props
}
```

### Context Development

Follow the established 3-file pattern with proper TypeScript typing and error boundaries.

### API Development

Use established React Query patterns with domain organization and proper cache management.

### Styling

- **Tailwind CSS v4** with custom utilities
- Use `cn()` utility from `~/lib/utils` for class merging
- Custom text sizes must be registered in utils.ts for tailwind-merge

**Conditional Styling Rules:**

- **ALWAYS use `cn()` object notation for conditional styles** instead of ternary operators
- **NEVER use ternary operators inside `cn()` function calls**
- ✅ CORRECT: `<TableRow className={cn({ 'pointer-events-none opacity-20': isLoaderVisible })}>`
- ✅ CORRECT: `className={cn('cursor-pointer', { 'text-purple font-bold': highlighted, 'hover:font-bold': !highlighted })}`
- ❌ AVOID: `<TableRow className={isLoaderVisible ? 'pointer-events-none opacity-20' : ''}>`
- ❌ AVOID: `className={cn('cursor-pointer', highlighted ? 'text-purple font-bold' : 'hover:font-bold')}`
- Benefits: cleaner code, better readability, consistent with tailwind-merge patterns

## Important Technical Details

### Git Requirements

- **Signed commits required** - ensure GPG signing is configured
- **GitHub Personal Access Token** needed for private packages

### Environment Setup

- **Node.js 22.14.0** (use nvm)
- **NPM configuration** for GitHub packages registry
- **Environment variables** delivered via secure channels

### Known Issues

**useWavesurfer Hook Caching**: In voiceover components, add URL timestamp (`?t=${Date.now()}`) to prevent caching
issues when reopening modals with same audio URL.

### Testing

- **Playwright** for end-to-end testing
- Test files in `tests/` directory
- Cloud testing available via `npm run test:cloud`

## Package Management

- Uses `@upscale-ai/control-room` for API types
- React Router v7 packages (not legacy react-router-dom)
- Comprehensive UI library with Radix primitives
- Canvas/Konva for graphics manipulation

# React Router v7 Framework Mode - Cursor Rules

## 🚨 CRITICAL: Route Type Imports - NEVER MAKE THIS MISTAKE

**THE MOST IMPORTANT RULE: ALWAYS use `./+types/[routeName]` for route type imports.**

```tsx
// ✅ CORRECT - ALWAYS use this pattern:
import type { Route } from "./+types/product-details";
import type { Route } from "./+types/product";
import type { Route } from "./+types/category";

// ❌ NEVER EVER use relative paths like this:
// import type { Route } from "../+types/product-details";  // WRONG!
// import type { Route } from "../../+types/product";       // WRONG!
```

**If you see TypeScript errors about missing `./+types/[routeName]` modules:**

1. **IMMEDIATELY run `typecheck`** to generate the types
2. **Or start the dev server** which will auto-generate types
3. **NEVER try to "fix" it by changing the import path**

## Type Generation & Workflow

- **Run `typecheck` after adding/renaming any routes**
- **Run `typecheck` if you see missing type errors**
- Types are auto-generated by `@react-router/dev` in `./+types/[routeName]` relative to each route file
- **The dev server will also generate types automatically**

---

## Critical Package Guidelines

### ✅ CORRECT Packages:

- `react-router` - Main package for routing components and hooks
- `@react-router/dev` - Development tools and route configuration
- `@react-router/node` - Node.js server adapter
- `@react-router/serve` - Production server

### ❌ NEVER Use:

- `react-router-dom` - Legacy package, use `react-router` instead
- `@remix-run/*` - Old packages, replaced by `@react-router/*`
- React Router v6 patterns - Completely different architecture

## Essential Framework Architecture

### Route Configuration (`app/routes.ts`)

```tsx
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("products/:id", "routes/product.tsx", [
    index("routes/product-overview.tsx"),
    route("reviews", "routes/product-reviews.tsx"),
  ]),
  route("categories", "routes/categories-layout.tsx", [
    index("routes/categories-list.tsx"),
    route(":slug", "routes/category-details.tsx"),
  ]),
] satisfies RouteConfig;
```

### Route Module Pattern (`app/routes/product.tsx`)

```tsx
import type { Route } from "./+types/product";

// Server data loading
export async function loader({ params }: Route.LoaderArgs) {
  return { product: await getProduct(params.id) };
}

// Client data loading (when needed)
export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  // runs on the client and is in charge of calling the loader if one exists via `serverLoader`
  const serverData = await serverLoader();
  return serverData;
}

// Form handling
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  await updateProduct(formData);
  return redirect(href("/products/:id", { id: params.id }));
}

// Component rendering
export default function Product({ loaderData }: Route.ComponentProps) {
  return <div>{loaderData.product.name}</div>;
}
```

### Layout/Parent Routes with Outlet

**For layout routes that have child routes, ALWAYS use `<Outlet />` to render child routes:**

````tsx
import type { Route } from "./+types/categories-layout";
import { Outlet } from "react-router";

export default function CategoriesLayout(props: Route.ComponentProps) {
  return (
    <div className="layout">
      <nav>
        {/* Sidebar or navigation */}
      </nav>
      <main>
        <Outlet /> {/* ✅ This renders the matching child route */}
      </main>
    </div>
  );
}

// ❌ Never use `children` from the component props, it doesn't exist
// export default function CategoriesLayout({ children }: Route.ComponentProps) {


## Automatic Type Safety & Generated Types

**React Router v7 automatically generates types for every route.** These provide complete type safety for loaders, actions, components, and URL generation.

### ✅ ALWAYS Use Generated Types:
Types are autogenerated and should be imported as `./+types/[routeFileName]`. **If you're getting a type error, run `npm run typecheck` first.**

The filename for the autogenerated types is always a relative import of `./+types/[routeFileName]`:

```tsx
// routes.ts
route("products/:id", "routes/product-details.tsx")

// routes/product-details.tsx
// ✅ CORRECT: Import generated types for each route
import type { Route } from "./+types/product-details";

export async function loader({ params }: Route.LoaderArgs) {
  // params.id is automatically typed based on your route pattern
  return { product: await getProduct(params.id) };
}

export default function ProductDetails({ loaderData }: Route.ComponentProps) {
  // loaderData.product is automatically typed from your loader return
  return <div>{loaderData.product.name}</div>;
}
````

### ✅ Type-Safe URL Generation with href():

```tsx
import { Link, href } from "react-router";

// Static routes
<Link to={href("/products/new")}>New Product</Link>

// Dynamic routes with parameters - AUTOMATIC TYPE SAFETY
<Link to={href("/products/:id", { id: product.id })}>View Product</Link>
<Link to={href("/products/:id/edit", { id: product.id })}>Edit Product</Link>

// Works with redirects too
return redirect(href("/products/:id", { id: newProduct.id }));
```

### ❌ NEVER Create Custom Route Types:

```tsx
// ❌ DON'T create custom type files for routes
export namespace Route {
  export interface LoaderArgs { /* ❌ */ }
  export interface ComponentProps { /* ❌ */ }
}

// ❌ DON'T manually construct URLs - no type safety
<Link to={`/products/${product.id}`}>Product</Link> // ❌
<Link to="/products/" + product.id">Product</Link> // ❌
```

### Type Generation Setup:

- **Location**: Types generated in `./+types/[routeName]` relative to each route file
- **Auto-generated**: Created by `@react-router/dev` when you run dev server or `npm run typecheck`
- **Comprehensive**: Covers `LoaderArgs`, `ActionArgs`, `ComponentProps`, `ErrorBoundaryProps`
- **TypeScript Config**: Add `.react-router/types/**/*` to `include` in `tsconfig.json`

## Critical Imports & Patterns

### ✅ Correct Imports:

```tsx
import { Link, Form, useLoaderData, useFetcher, Outlet } from "react-router";
import { type RouteConfig, index, route } from "@react-router/dev/routes";
import { data, redirect, href } from "react-router";
```

## Data Loading & Actions

### Server vs Client Data Loading:

```tsx
// Server-side rendering and pre-rendering
export async function loader({ params }: Route.LoaderArgs) {
  return { product: await serverDatabase.getProduct(params.id) };
}

// Client-side navigation and SPA mode
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return {
    product: await fetch(`/api/products/${params.id}`).then((r) => r.json()),
  };
}

// Use both together - server for SSR, client for navigation
clientLoader.hydrate = true; // Force client loader during hydration
```

### Form Handling & Actions:

```tsx
// Server action
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const result = await updateProduct(formData);
  return redirect(href("/products"));
}

// Client action (takes priority if both exist)
export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  await apiClient.updateProduct(formData);
  return { success: true };
}

// In component
<Form method="post">
  <input name="name" placeholder="Product name" />
  <input name="price" type="number" placeholder="Price" />
  <button type="submit">Save Product</button>
</Form>;
```

## Navigation & Links

### Basic Navigation:

```tsx
import { Link, NavLink } from "react-router";

// Simple links
<Link to="/products">Products</Link>

// Active state styling
<NavLink to="/dashboard" className={({ isActive }) =>
  isActive ? "active" : ""
}>
  Dashboard
</NavLink>

// Programmatic navigation
const navigate = useNavigate();
navigate("/products");
```

### Advanced Navigation with Fetchers:

```tsx
import { useFetcher } from "react-router";

function AddToCartButton({ productId }: { productId: string }) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" action="/api/cart">
      <input type="hidden" name="productId" value={productId} />
      <button type="submit">
        {fetcher.state === "submitting" ? "Adding..." : "Add to Cart"}
      </button>
    </fetcher.Form>
  );
}
```

## Using the `cn()` Utility for Conditional Styling

As your guide mentioned, use the `cn()` utility for conditional styling:

```tsx
import { cn } from "~/lib/utils";

function ExampleComponent({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={cn("rounded p-4", {
        "bg-background text-foreground": !isActive,
        "bg-primary text-primary-foreground": isActive,
      })}
    >
      Content
    </div>
  );
}
```

## File Organization & Naming

### ✅ Flexible File Naming:

React Router v7 uses **explicit route configuration** in `app/routes.ts`. You are NOT constrained by old file-based
routing conventions.

```tsx
// ✅ Use descriptive, clear file names
export default [
  route("products", "routes/products-layout.tsx", [
    index("routes/products-list.tsx"),
    route(":id", "routes/product-details.tsx"),
    route(":id/edit", "routes/product-edit.tsx"),
  ]),
] satisfies RouteConfig;
```

### File Naming Best Practices:

- Use **descriptive names** that clearly indicate purpose
- Use **kebab-case** for consistency (`product-details.tsx`)
- Organize by **feature** rather than file naming conventions
- The **route configuration** is the source of truth, not file names

## Error Handling & Boundaries

### Route Error Boundaries:

Only setup `ErrorBoundary`s for routes if the users explicitly asks. All errors bubble up to the `ErrorBoundary` in
`root.tsx` by default.

```tsx
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Oops!</h1>
      <p>{error.message}</p>
    </div>
  );
}
```

### Throwing Errors from Loaders/Actions:

```tsx
export async function loader({ params }: Route.LoaderArgs) {
  const product = await db.getProduct(params.id);
  if (!product) {
    throw data("Product Not Found", { status: 404 });
  }
  return { product };
}
```

## Advanced Patterns

### Pending UI & Optimistic Updates:

```tsx
import { useNavigation, useFetcher } from "react-router";

// Global pending state
function GlobalSpinner() {
  const navigation = useNavigation();
  return navigation.state === "loading" ? <Spinner /> : null;
}

// Optimistic UI with fetchers
function CartItem({ item }) {
  const fetcher = useFetcher();
  const quantity = fetcher.formData
    ? parseInt(fetcher.formData.get("quantity"))
    : item.quantity;

  return (
    <fetcher.Form method="post">
      <input
        type="number"
        name="quantity"
        value={quantity}
        onChange={(e) => fetcher.submit(e.currentTarget.form)}
      />
      {item.product.name}
    </fetcher.Form>
  );
}
```

### Progressive Enhancement:

```tsx
// Works without JavaScript, enhanced with JavaScript
export default function ProductSearchForm() {
  return (
    <Form method="get" action="/products">
      <input type="search" name="q" placeholder="Search products..." />
      <button type="submit">Search</button>
    </Form>
  );
}
```

## Anti-Patterns to Avoid

### ❌ React Router v6 Patterns:

```tsx
// DON'T use component routing
<Routes>
  <Route path="/" element={<Home />} />
</Routes>
```

### ❌ Manual Data Fetching:

```tsx
// DON'T fetch in components
function Product() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api/products");
  }, []);
  // Use loader instead!
}
```

### ❌ Manual Form Handling:

```tsx
// DON'T handle forms manually
const handleSubmit = (e) => {
  e.preventDefault();
  fetch("/api/products", { method: "POST" });
};
// Use Form component and action instead!
```

## Essential Type Safety Rules

1. **ALWAYS** import from `"./+types/[routeName]"` - never use relative paths like `"../+types/[routeName]"`
2. **RUN `npm run typecheck`** when you see missing type errors - never try to "fix" the import path
3. **ALWAYS** use `href()` for dynamic URLs - never manually construct route strings
4. **LET TypeScript infer** loader/action return types - don't over-type returns
5. **USE Route.ComponentProps** for your route components - automatic loaderData typing
6. **ADD** `.react-router/types/**/*` to your `tsconfig.json` include array

## AI Assistant Guidelines

When working with React Router v7:

- **If you see missing `./+types/[routeName]` imports, ALWAYS suggest running `npm run typecheck` first**
- **NEVER suggest changing `./+types/[routeName]` to `../+types/[routeName]` or any other relative path**
- **After creating new routes, remind the user to run `npm run typecheck`**
- **Assume types need to be generated if they're missing, don't assume the dev server is running**

# MCP Servers

## Figma Dev Mode MCP Rules

- The Figma Dev Mode MCP Server provides an assets endpoint which can serve image and SVG assets
- IMPORTANT: If the Figma Dev Mode MCP Server returns a localhost source for an image or an SVG, use that image or SVG
  source directly
- IMPORTANT: DO NOT import/add new icon packages, all the assets should be in the Figma payload
- IMPORTANT: do NOT use or create placeholders if a localhost source is provided
