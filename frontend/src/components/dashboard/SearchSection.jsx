import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { Input } from "../ui/Input.jsx";

export const SearchSection = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  error
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
        value={value}
        onChange={(event) => onChange(event.target.value)}
        error={error}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Analyzing..." : "Analyze"}
      </Button>
    </form>
  </Card>
);
