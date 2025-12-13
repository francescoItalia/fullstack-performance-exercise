type PageTitleProps = {
  /** Page title */
  title: string;
  /** Page description */
  description: string;
};

/**
 * Page title with description.
 * Used at the top of page content areas.
 */
export function PageTitle({ title, description }: PageTitleProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}

