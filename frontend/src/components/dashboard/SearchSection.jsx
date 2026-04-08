import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { Input } from "../ui/Input.jsx";

export const SearchSection = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  error,
  suggestions = [],
  onSelectSuggestion
}) => (
  <Card
    title="Search GitHub Profile"
    subtitle="Enter a username to analyze repositories, pull requests, and coding activity."
  >
    <form className="search-form" onSubmit={onSubmit}>
      <Input
        id="username"
        label="GitHub Username"
        placeholder="e.g. torvalds"
        hint="Tip: GitHub usernames can only contain letters, numbers, and single hyphens."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        error={error}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Analyzing..." : "Analyze"}
      </Button>
    </form>
    {suggestions.length ? (
      <div className="suggestion-row">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className="suggestion-chip"
            onClick={() => onSelectSuggestion?.(suggestion)}
            disabled={isLoading}
          >
            {suggestion}
          </button>
        ))}
      </div>
    ) : null}
  </Card>
);
