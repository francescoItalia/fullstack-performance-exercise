type InfoBoxProps = {
  /** Box title */
  title: string;
  /** Box content/description */
  description: string;
};

/**
 * Info box for contextual information.
 * Used for "About this exercise" or similar explanatory sections.
 */
export function InfoBox({ title, description }: InfoBoxProps) {
  return (
    <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
      <h2 className="font-semibold text-indigo-900 mb-2">{title}</h2>
      <p className="text-sm text-indigo-700">{description}</p>
    </div>
  );
}
